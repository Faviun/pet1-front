/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEffect } from 'effector'
import { toast } from 'react-toastify'
import { ISignUpFx, ISignInFx } from '../types/auth'
import api from './axiosClient'
import { AxiosError } from 'axios'
import { HTTPStatus } from '@/lib/constans'

export const singUpFx = createEffect(
  async ({ url, username, password, email }: ISignUpFx) => {
    try {
      const { data } = await api.post(url, { username, password, email })

      if (data.warningMessage) {
        const error = new Error(data.warningMessage)
        ;(error as any).response = {
          data: {
            warningMessage: data.warningMessage,
          },
        }
        throw error
      }
      toast.success('Регистрация прошла успешно!')
      return data
    } catch (error) {
      if ((error as any)?.response?.data?.warningMessage) {
        throw error
      }

      const axiosError = error as AxiosError
      if (axiosError.response) {
        const serverError = new Error('Ошибка при регистрации')
        ;(serverError as any).response = axiosError.response
        throw serverError
      }

      toast.error((error as Error).message)
      throw error
    }
  }
)

export const singInFx = createEffect(
  async ({ url, username, password }: ISignInFx) => {
    try {
      const { data } = await api.post(url, { username, password })

      if (data.warningMessage) {
        const error = new Error(data.warningMessage)
        ;(error as any).response = {
          data: {
            warningMessage: data.warningMessage,
          },
        }
        throw error
      }

      toast.success('Вход выполнен!')
      return data
    } catch (error) {
      if ((error as any)?.response?.data?.warningMessage) {
        throw error
      }
      toast.error((error as Error).message)
      throw error
    }
  }
)

export const checkUserAuthFx = createEffect(async (url: string) => {
  try {
    const { data } = await api.get(url)
    return data
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response) {
      if (axiosError.response.status === HTTPStatus.FORBIDDEN) {
        return false
      }
    }

    toast.error((error as Error).message)
    throw error
  }
})

export const logoutFx = createEffect(async (url: string) => {
  try {
    await api.get(url)
  } catch (error) {
    toast.error((error as Error).message)
    throw error
  }
})
