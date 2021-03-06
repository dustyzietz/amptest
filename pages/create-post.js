import { withAuthenticator } from '@aws-amplify/ui-react'
import { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import { createPost } from '../graphql/mutations'
import { Auth } from 'aws-amplify'


const initialState = { title: '', content: '' }

function CreatePost() {
    const [post, setPost] = useState(initialState)
    const { title, content } = post
    const router = useRouter()
    const [user, setUser] = useState(null)
    
    useEffect(() => {
      checkUser()
    }, [])
    async function checkUser() {
      const user = await Auth.currentAuthenticatedUser()
      setUser(user)
    }
    if (!user) return null



  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const id = uuid()
    post.id = id
    post.username = user.username

   
    await API.graphql({
      query: createPost,
      variables: { input: post }
    })
    router.push(`/posts/${id}`)
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <button
        type="button"
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPost}
      >Create Post</button>
    </div>
  )
}

export default withAuthenticator(CreatePost)