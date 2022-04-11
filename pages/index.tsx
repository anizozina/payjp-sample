import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { useCallback, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [payjp, setPayjp] = useState<any>(null)
  const [elements, setElements] = useState<any>(null)
  const [result, setResult] = useState<string>()

  useEffect(() => {
    if (payjp) {
      const elements = payjp.elements()
      /** 
       * 入力フォームを生成する。
       * cardを指定するとすべての要素が横並びで表示される。
       * 分けて表示したい場合は cardNumber や cardExpiry など個別に指定するs
       */
      const cardElement = elements.create('card')
      // elementをDOMに配置する
      cardElement.mount('#v2-demo')
      setElements(elements)
    }
  }, [payjp])
  function handleLoad() {
    // @ts-ignore
    const payjp = window.Payjp(process.env.NEXT_PUBLIC_PAYJP_PUBLIC_TOKEN)
    setPayjp(payjp)
  }

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const cardElement = elements.getElement('card')
    payjp.createToken(cardElement)
      .then((response: any) => {
        if (response.error) {
          console.error(response)
          const error = response.error as string
          setResult(error)
          return
        }
        const token = response as {id: string}
        setResult(token.id)
      })
      .catch((error: Error) => {
        console.error(error)
        setResult(error.message)
      })
    event.preventDefault()
  }, [payjp, elements])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Payjp Sample</title>
        <meta name="description" content="sample app for payjp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ width: '70%', padding: '4px' }}>
          <Script src='https://js.pay.jp/v2/pay.js' onLoad={handleLoad} />
          <div id="v2-demo" className="payjs-outer" style={{ padding: '4px', marginBottom: '8px' }}></div>
          <button onClick={handleClick}>トークン作成</button>
          <span id="token">{result}</span>
        </div>
      </main>
    </div>
  )
}

export default Home