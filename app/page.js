'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
  BackgroundFiltersProvider,
  useBackgroundFilters,
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { formatDuration, intervalToDuration } from 'date-fns'
import vi from 'date-fns/locale/vi'
import { api_url } from '@/api'
import Image from 'next/image'

let isLoaded = false

function MyBackgroundFilterSettings() {
  const {
    isSupported,
    isReady,
    disableBackgroundFilter,
    applyBackgroundBlurFilter,
    applyBackgroundImageFilter,
    backgroundImages,
  } = useBackgroundFilters()

  if (!isSupported) return null
  if (!isReady) return <div className="my-loading-indicator" />

  return (
    <div className="background-box">
      <h3>Hiệu ứng phông nền</h3>
      <ul>
        <li>
          <button onClick={disableBackgroundFilter}>
            <Image width={60} height={60} src="/nobackground.jpg" alt="none" />
          </button>
        </li>
        <li>
          <button onClick={() => applyBackgroundBlurFilter('medium')}>
            <Image width={60} height={60} src="/blur.jpg" alt="blur" />
          </button>
        </li>
        {backgroundImages.map((image, index) => (
          <li key={image}>
            <button onClick={() => applyBackgroundImageFilter(image)}>
              <Image width={60} height={60} src={image} alt="background" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function useSessionTimer() {
  const { useCallSession } = useCallStateHooks()
  const session = useCallSession()
  const [remainingMs, setRemainingMs] = useState(Number.NaN)

  useEffect(() => {
    if (!session?.timer_ends_at) return
    const timerEndAt = new Date(session.timer_ends_at)
    const handle = setInterval(() => {
      const now = new Date()
      setRemainingMs(+timerEndAt - +now)
    }, 1000)
    return () => clearInterval(handle)
  }, [session])

  return remainingMs
}

function SessionTimer() {
  const remainingMs = useSessionTimer()
  if (remainingMs < 0) return null
  return (
    <div className="session-timer" style={{ textAlign: 'center' }}>
      {formatDuration(intervalToDuration({ start: Date.now(), end: Date.now() + remainingMs }), { locale: vi })}
    </div>
  )
}

function PageWithParams() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const phongkhamId = searchParams.get('phongkhamId')

  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [sessionId, setSessionId] = useState('')

  const validateCall = async () => {
    const res = await fetch(`${api_url()}kham_online_auth?userId=${userId}&phongkhamId=${phongkhamId}`)
    return res.json()
  }

  useEffect(() => {
    if (!userId || !phongkhamId) {
      alert('Thông tin không hợp lệ. Truy cập sẽ được chuyển hướng về trang chủ.')
      window.location.href = 'https://bcare.vn'
      return
    }

    validateCall().then((res) => {
      if (res.type === 'success') {
        initCall(res)
      } else {
        alert(res.message)
        window.location.href = 'https://bcare.vn'
      }
    })
  }, [userId, phongkhamId])

  const initCall = async (dkkInfo) => {
    if (isLoaded) return
    isLoaded = true

    const apiKey = 'pnwf8hccjv6n'
    const tokenProvider = async () => {
      const res = await fetch('/create-token?userId=' + userId)
      const text = await res.text()
      const match = text.match(/<div id="token">(.*?)<\/div>/)
      return match?.[1] || null
    }

    const user = {
      id: userId,
      name: dkkInfo.data.user_info.hovaten,
      image: dkkInfo.data.user_info.avatar,
    }

    const streamClient = new StreamVideoClient({
      apiKey,
      user,
      tokenProvider,
      options: { maxConnectUserRetries: 2 },
    })

    const callInstance = streamClient.call('default', phongkhamId)
    const startsAt = new Date(Date.now() + 30 * 60 * 1000)

    await callInstance.join({
      create: true,
      data: {
        starts_at: startsAt,
        settings_override: {
          limits: { max_duration_seconds: 1500 },
        },
        mic_default_on: true,
        speaker_default_on: true,
        camera_default_on: true,
        backstage: true,
      },
    })

    setClient(streamClient)
    setCall(callInstance)
  }

  useEffect(() => {
    if (!client || !call) return

    call.startTranscription({ language: 'en' })

    const unsub = client.on('all', (event) => {
      if (event.type === 'call.session_participant_joined') {
        const uid = event?.participant?.user?.id
        const sid = event?.participant?.user_session_id
        if (uid === userId) {
          if (sessionId === '') {
            setSessionId(sid)
          } else if (sid !== sessionId) {
            alert('Có người dùng cùng ID truy cập')
            call.leave()
          }
        }
      }
    })

    return () => unsub.unsubscribe?.()
  }, [client, call, sessionId, userId])

  if (client && call) {
    return (
      <div className="container-call">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme>
              <BackgroundFiltersProvider
                backgroundImages={['/bg1.jpg', '/bg2.jpg', '/bg3.jpg', '/bg4.jpg', '/bg5.jpg', '/bg6.jpg']}
              >
                <SessionTimer />
                <SpeakerLayout />
                <CallControls />
                <MyBackgroundFilterSettings />
              </BackgroundFiltersProvider>
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>
    )
  }

  return (
    <div className="call-placerholder-box">
      <div>
        <div className="is-animating mb-2">
          <Image src="/logo.png" width={150} height={150} alt="Bcare" className="logo" />
        </div>
        <span className="animating-text">Đang xác thực thông tin phiên khám ...</span>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PageWithParams />
    </Suspense>
  )
}
