import tw from 'twin.macro';
import * as Icon from 'react-feather';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { ServerContext } from '@/state/server';
import Modal from '@/components/elements/Modal';
import React, { useEffect, useState } from 'react';
import { SocketEvent } from '@/components/server/events';
import { Button } from '@/components/elements/button/index';
import FlashMessageRender from '@/components/FlashMessageRender';

const PIDLimitModalFeature = () => {
    const [visible, setVisible] = useState(false);
    const [loading] = useState(false);

    const status = ServerContext.useStoreState((state) => state.status.value);
    const { clearFlashes } = useFlash();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const isAdmin = useStoreState((state) => state.user.data!.rootAdmin);

    useEffect(() => {
        if (!connected || !instance || status === 'running') return;

        const errors = [
            'pthread_create failed',
            'failed to create thread',
            'unable to create thread',
            'unable to create native thread',
            'unable to create new native thread',
            'exception in thread "craft async scheduler management thread"',
        ];

        const listener = (line: string) => {
            if (errors.some((p) => line.toLowerCase().includes(p))) {
                setVisible(true);
            }
        };

        instance.addListener(SocketEvent.CONSOLE_OUTPUT, listener);

        return () => {
            instance.removeListener(SocketEvent.CONSOLE_OUTPUT, listener);
        };
    }, [connected, instance, status]);

    useEffect(() => {
        clearFlashes('feature:pidLimit');
    }, []);

    return (
        <Modal
            visible={visible}
            onDismissed={() => setVisible(false)}
            closeOnBackground={false}
            showSpinnerOverlay={loading}
        >
            <FlashMessageRender key={'feature:pidLimit'} css={tw`mb-4`} />
            {isAdmin ? (
                <>
                    <div css={tw`mt-4 sm:flex items-center`}>
                        <Icon.AlertTriangle css={tw`pr-4`} color={'orange'} size={'4x'} />
                        <h2 css={tw`text-2xl mb-4 text-neutral-100 `}>Memory or process limit reached...</h2>
                    </div>
                    <p css={tw`mt-4`}>Este servidor atingiu o limite máximo de processo ou memória.</p>
                    <p css={tw`mt-4`}>
                        Aumentar <code css={tw`font-mono bg-neutral-900`}>container_pid_limit</code> nas configurações
                        da Wings, <code css={tw`font-mono bg-neutral-900`}>config.yml</code>, Pode ajudar a resolver
                        esse assunto.
                    </p>
                    <p css={tw`mt-4`}>
                        <b>
                            Nota: as Wings devem ser reiniciadas para as alterações do arquivo de configuração para
                            entrar em vigor
                        </b>
                    </p>
                    <div css={tw`mt-8 sm:flex items-center justify-end`}>
                        <Button onClick={() => setVisible(false)} css={tw`w-full sm:w-auto border-transparent`}>
                            Close
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div css={tw`mt-4 sm:flex items-center`}>
                        <Icon.AlertTriangle css={tw`pr-4`} color={'orange'} size={'4x'} />
                        <h2 css={tw`text-2xl mb-4 text-neutral-100`}>Possível limite de recursos alcançado...</h2>
                    </div>
                    <p css={tw`mt-4`}>
                        Este servidor está tentando usar mais recursos do que o alocado. Entre em contato com o
                        administrador e dê a eles o erro abaixo.
                    </p>
                    <p css={tw`mt-4`}>
                        <code css={tw`font-mono bg-neutral-900`}>
                            pthread_create falhou, Possivelmente sem memória ou limites de processo/recursos atingidos
                        </code>
                    </p>
                    <div css={tw`mt-8 sm:flex items-center justify-end`}>
                        <Button onClick={() => setVisible(false)} css={tw`w-full sm:w-auto border-transparent`}>
                            Fechar
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default PIDLimitModalFeature;
