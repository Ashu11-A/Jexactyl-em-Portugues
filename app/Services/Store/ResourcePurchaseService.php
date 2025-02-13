<?php

namespace Pterodactyl\Services\Store;

use Illuminate\Support\Facades\DB;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Api\Client\Store\PurchaseResourceRequest;

class ResourcePurchaseService
{
    /**
     * ResourcePurchaseService constructor.
     */
    public function __construct(private SettingsRepositoryInterface $settings)
    {
    }

    /**
     * This service processes the purchase of resources
     * via the Jexactyl Storefront.
     *
     * @throws DisplayException
     */
    public function handle(PurchaseResourceRequest $request)
    {
        $user = $request->user();
        $balance = $user->store_balance;
        $resource = $request->input('resource');
        $cost = $this->get($resource);
        $current = DB::table('users')
            ->where('id', $user->id)
            ->pluck('store_' . $resource)
            ->first();

        if ($balance < $cost) {
            throw new DisplayException('Você não possui créditos suficientes.');
        }

        $user->update([
            'store_balance' => $balance - $cost,
            'store_' . $resource => $current + $this->amount($resource),
        ]);
    }

    /**
     * Returns how much of the resource to assign.
     *
     * @throws DisplayException
     */
    protected function amount(string $resource): int
    {
        return match ($resource) {
            'cpu' => 50,
            'disk', 'memory' => 1024,
            'slots', 'ports', 'backups', 'databases' => 1,
            default => throw new DisplayException('Unable to parse resource type')
        };
    }

    /**
     * Shortcut method to get data from the database.
     */
    protected function get(string $resource): mixed
    {
        if (in_array($resource, ['slots', 'ports', 'backups', 'databases'])) {
            $resource = rtrim($resource, 's');
        }

        return $this->settings->get('jexactyl::store:cost:' . $resource);
    }
}
