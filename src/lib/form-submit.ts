"use client";

import { startTransition, type FormEvent } from "react";

/**
 * onSubmit для форм с useActionState. React 19 очищает поля формы после
 * <form action={…}> — даже если сервер вернул ошибку валидации, и пользователь
 * теряет введённое. Запуская action сами в transition, мы сохраняем значения.
 * action={dispatch} на форме оставляем: до гидратации нативной отправки не будет.
 */
export function submitWith(dispatch: (form: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const form = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(form));
  };
}
