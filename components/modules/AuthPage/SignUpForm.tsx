'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useUnit } from 'effector-react'
import NameInput from '@/components/elements/AuthPage/NameInput'
import { IInputs } from '@/lib/types/auth'
import { $mode } from '@/context/mode'
import EmailInput from '@/components/elements/AuthPage/EmailInput'
import PasswordInput from '@/components/elements/AuthPage/PasswordInput'
import { singUpFx } from '@/lib/api/auth'
import styles from '@/styles/auth.module.scss'
import spinnerStyles from '@/styles/spinner.module.scss'

const SignUpForm = ({ switchForm }: { switchForm: () => void }) => {
  const [spinner, setSpinner] = useState(false)
  const [serverError, setServerError] = useState<string>('')
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
    setError,
  } = useForm<IInputs>()
  const mode = useUnit($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const onSubmit = async (data: IInputs) => {
    try {
      setSpinner(true)
      setServerError('')

      const userData = await singUpFx({
        url: '/users/signup',
        username: data.name,
        password: data.password,
        email: data.email,
      })

      resetField('email')
      resetField('name')
      resetField('password')
      switchForm()
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.warningMessage || error?.message

      if (errorMessage) {
        if (errorMessage.toLowerCase().includes('email')) {
          setError('email', { type: 'manual', message: errorMessage })
        } else if (errorMessage.toLowerCase().includes('username')) {
          setError('name', { type: 'manual', message: errorMessage })
        } else {
          setServerError(errorMessage)
        }
      }
    } finally {
      setSpinner(false)
    }
  }

  return (
    <form
      className={`${styles.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Создать аккаунт
      </h2>

      <NameInput register={register} errors={errors} />
      <EmailInput register={register} errors={errors} />
      <PasswordInput register={register} errors={errors} />

      {serverError && (
        <div className={`${styles.form__error} ${darkModeClass}`}>
          {serverError}
        </div>
      )}

      <button
        className={`${styles.form__button} ${styles.button} ${styles.submit} ${darkModeClass}`}
        disabled={spinner}
      >
        {spinner ? <div className={spinnerStyles.spinner} /> : 'РЕГИСТРАЦИЯ'}
      </button>
    </form>
  )
}

export default SignUpForm
