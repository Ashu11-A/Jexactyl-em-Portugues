import tw from 'twin.macro';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import discordLogin from '@/api/auth/discord';
import { Button } from '@/components/elements/button/index';
import DiscordFormContainer from '@/components/auth/DiscordFormContainer';

const DiscordContainer = () => {
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [loading, setLoading] = useState(false);

    const login = () => {
        clearFlashes();
        setLoading(true);

        discordLogin()
            .then((data) => {
                if (!data) return clearAndAddHttpError({ error: 'A autenticação do Discord falhou. Por favor tente novamente.' });
                window.location.href = data;
            })
            .then(() => setLoading(false))
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <DiscordFormContainer css={tw`w-full flex`}>
            <div css={tw`flex flex-col md:h-full`}>
                <div css={tw`mt-6`}>
                    <Button type={'button'} css={tw`w-full`} onClick={() => login()} disabled={loading}>
                        Conectar com Discord
                    </Button>
                </div>
                <div css={tw`mt-6 text-center`}>
                    <Link
                        to={'/auth/login'}
                        css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
                    >
                        Voltar ao Login
                    </Link>
                </div>
            </div>
        </DiscordFormContainer>
    );
};

export default DiscordContainer;
