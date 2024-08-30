import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import icon from '../images/message.svg'
import styles from '../styles/Chat.module.css'
import EmojiPicker from 'emoji-picker-react'
import Messages from './Messages'

const socket = io.connect('https://chat-server-0yqw.onrender.com')

const Chat = () => {
    const navigate = useNavigate()
    const { search } = useLocation()
    const [userParams, setUserParams] = useState({ room: '', user: '' })
    const [usersCount, setUsersCount] = useState(0)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false)

    const handleChange = ({ target: { value } }) => setMessage(value)
    const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`)
    const leftRoom = () => {
        socket.emit('leftRoom', { userParams })
        navigate('/')
    }
    const handleSubmit = e => {
        e.preventDefault()

        if (!message.trim()) return

        socket.emit('sendMessage', { message, userParams })

        setMessage('')
    }

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setUserParams(searchParams)
        socket.emit('join', searchParams)
    }, [search])

    useEffect(() => {
        socket.on('message', ({ data }) => {
            setMessages(_state => [..._state, data])
        })
    }, [])

    useEffect(() => {
        socket.on('room', ({ data: { users } }) => {
            setUsersCount(users.length)
        })
    }, [])

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.title}>{userParams.room}</div>
                <div className={styles.users}>
                    {usersCount} users in this room now
                </div>
                <button className={styles.left} onClick={leftRoom}>
                    Left the room
                </button>
            </div>

            <div className={styles.messages}>
                <Messages messages={messages} name={userParams.name} />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.input}>
                    <input
                        type="text"
                        name="message"
                        placeholder="What do you want to say?"
                        value={message}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={styles.emoji}>
                    <img
                        src={icon}
                        alt=""
                        onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
                    />

                    {isEmojiPickerOpen && (
                        <div className={styles.emojies}>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>

                <div className={styles.button}>
                    <input
                        type="submit"
                        onSubmit={handleSubmit}
                        value="Send a message"
                    />
                </div>
            </form>
        </div>
    )
}

export default Chat
