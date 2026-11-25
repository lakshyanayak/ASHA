
import { useState } from 'react'
import "./AskAsha.css";

const API_URL = 'http://127.0.0.1:8000'

function AskAsha() {
  const [question, setQuestion] = useState('')

  const [messages, setMessages] = useState([
    {
      sender: 'asha',
      text: "Hello! I'm Asha. Ask me anything about your recorded wellness data."
    }
  ])

  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState('')

  const sendQuestion = async (event) => {
    event.preventDefault()

    const userQuestion = question.trim()

    if (!userQuestion || loading) return

    setMessages(previous => [
      ...previous,
      {
        sender: 'user',
        text: userQuestion
      }
    ])

    setQuestion('')
    setLoading(true)
    setError('')
    setAudioUrl(null)

    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: userQuestion,
          include_voice: true
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to generate Asha response.'
        )
      }

      setMessages(previous => [
        ...previous,
        {
          sender: 'asha',
          text: data.answer
        }
      ])

      if (data.audio_url) {
        setAudioUrl(
          `${API_URL}${data.audio_url}?t=${Date.now()}`
        )
      }

    } catch (err) {
      let errorMessage

      if (err instanceof TypeError) {
        errorMessage =
          'Asha is temporarily unavailable. Please check that the backend server is running and try again.'
      } else {
        errorMessage =
          err.message || 'Something went wrong. Please try again.'
      }

      setError(errorMessage)

      setMessages(previous => [
        ...previous,
        {
          sender: 'asha',
          text: errorMessage
        }
      ])

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="asha-page">

      <section className="asha-card">

        <header className="asha-header">

          <div className="asha-avatar">A</div>

          <div>
            <h1>Ask Asha</h1>
            <p>Your Personalised Wellness Assistant</p>
          </div>

          <span className="asha-status">● Online</span>

        </header>

        <div className="asha-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender}`}
            >

              <span className="message-name">
                {message.sender === 'asha' ? 'Asha' : 'You'}
              </span>

              <p>{message.text}</p>

            </div>
          ))}

          {loading && (
            <div className="message asha">
              <span className="message-name">Asha</span>
              <p>Preparing your response...</p>
            </div>
          )}

        </div>

        {error && (
          <div className="asha-error" role="alert">
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="asha-audio">

            <p>Listen to Asha's response</p>

            <audio
              controls
              src={audioUrl}
              key={audioUrl}
            >
              Your browser does not support audio playback.
            </audio>

          </div>
        )}

        <form
          className="asha-input-area"
          onSubmit={sendQuestion}
        >

          <input
            type="text"
            placeholder="Ask Asha about your wellness..."
            value={question}
            onChange={event => setQuestion(event.target.value)}
            disabled={loading}
            maxLength={1000}
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

        </form>

        <footer className="asha-footer">
          Asha Wellness Assistant
        </footer>

      </section>

    </main>
  )
}

export default AskAsha
