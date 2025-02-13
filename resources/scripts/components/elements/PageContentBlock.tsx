import tw from 'twin.macro';
import React, { useEffect } from 'react';
import { useStoreState } from '@/state/hooks';
import { Alert } from '@/components/elements/alert';
import { CSSTransition } from 'react-transition-group';
import FlashMessageRender from '@/components/FlashMessageRender';
import ContentContainer from '@/components/elements/ContentContainer';

export interface PageContentBlockProps {
    title?: string;
    description?: string | null;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({
    title,
    description,
    showFlashKey,
    className,
    children,
}) => {
    const alert = useStoreState((state) => state.settings.data!.alert);

    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <div css={tw`my-4`}>
                <ContentContainer className={className}>
                    {alert.message && (
                        <Alert type={alert.type} className={'my-4'}>
                            {alert.message}
                        </Alert>
                    )}
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`my-4`} />}
                    {description && (
                        <>
                            <h1 className={'j-left text-5xl'}>{title}</h1>
                            <h3 className={'j-left text-2xl text-neutral-500'}>{description}</h3>
                        </>
                    )}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`text-sm text-center my-4`}>
                    <p css={tw`text-neutral-500 sm:float-left`}>
                        &copy; <a href={'https://jexactyl.com'}>Jexactyl,</a> feito sobre{' '}
                        <a href={'https://pterodactyl.io'}>Pterodactyl.</a>
                    </p>
                    <p css={tw`text-neutral-500 sm:float-right`}>
                        <a href={'https://jexactyl.com'}> Site </a>
                        &bull;
                        <a href={'https://github.com/ashu11-a/jexactyl_pt-br'}> GitHub </a>
                    </p>
                </ContentContainer>
            </div>
        </CSSTransition>
    );
};

export default PageContentBlock;
