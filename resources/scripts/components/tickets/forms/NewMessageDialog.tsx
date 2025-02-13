import React from 'react';
import tw from 'twin.macro';
import { object, string } from 'yup';
import styled from 'styled-components';
import useFlash from '@/plugins/useFlash';
import { useRouteMatch } from 'react-router';
import { httpErrorToHuman } from '@/api/http';
import { createMessage } from '@/api/account/tickets';
import { Textarea } from '@/components/elements/Input';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@/components/elements/button/index';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Dialog, DialogProps } from '@/components/elements/dialog';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';

interface Values {
    description: string;
}

const CustomTextarea = styled(Textarea)`
    ${tw`h-32`}
`;

export default ({ open, onClose }: DialogProps) => {
    const match = useRouteMatch<{ id: string }>();
    const id = parseInt(match.params.id);

    const { addError, clearFlashes, addFlash } = useFlash();

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes('tickets');

        createMessage(id, values.description)
            .then(() => {
                resetForm();
                setSubmitting(false);

                addFlash({
                    key: 'tickets',
                    type: 'success',
                    message: 'Sua mensagem foi enviada com sucesso.',
                });
            })
            .catch((error) => {
                setSubmitting(false);

                addError({ key: 'tickets', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={'Adicionar uma mensagem'}
            description={'Esta mensagem será visível tanto para você quanto para os administradores deste Painel.'}
            preventExternalClose
        >
            <Formik
                onSubmit={submit}
                initialValues={{ description: '' }}
                validationSchema={object().shape({
                    description: string().required().min(4),
                })}
            >
                {({ isSubmitting }) => (
                    <Form className={'mt-6'}>
                        <SpinnerOverlay visible={isSubmitting} />
                        <FormikFieldWrapper
                            label={'Descrição'}
                            name={'description'}
                            description={
                                'Forneça informações adicionais, imagens e outros conteúdos a fim de nos ajudar a resolver seu problema mais rapidamente.'
                            }
                        >
                            <Field name={'description'} as={CustomTextarea} />
                        </FormikFieldWrapper>
                        <div className={'flex justify-end mt-6'}>
                            <Button type={'submit'}>Enviar</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
