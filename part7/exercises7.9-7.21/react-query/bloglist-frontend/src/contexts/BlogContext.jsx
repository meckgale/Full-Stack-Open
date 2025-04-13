import { createContext, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { create, getAll, update, remove, addComment } from '../services/blogs'
import useNotify from '../hooks/useNotify'

const BlogContext = createContext()

export const BlogProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const {
    data: blogs = [],
    isLoading: blogsLoading,
    isError: blogsError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const createBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) || []
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: (blogObject) => update(blogObject.id, blogObject),
    onSuccess: (updatedPost) => {
      console.log('Update successful:', updatedPost)
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) =>
          blog.id !== updatedPost.id
            ? blog
            : {
                ...updatedPost,
                user: blog.user,
              }
        )
      )
      notify(
        `you liked '${updatedPost.title}' by ${updatedPost.author}`,
        'success'
      )
    },
    onError: (error) => {
      console.error('Update mutation error:', error)
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => addComment(id, comment),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) =>
          blog.id !== updatedBlog.id
            ? blog
            : {
                ...updatedBlog,
                user: blog.user,
              }
        )
      )
      notify('Comment added successfully', 'success')
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (blogObject) => remove(blogObject.id),
    onSuccess: (_, deletedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((blog) => blog.id !== deletedBlog.id)
      )
      notify('Blog deleted successfully', 'success')
    },
  })

  const createBlog = async (blog) => {
    try {
      const result = await createBlogMutation.mutateAsync(blog)
      return { success: true, blog: result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateBlog = async (blog) => {
    console.log('updateBlog called with:', blog)
    try {
      const result = await updateBlogMutation.mutateAsync(blog)
      console.log('Update result:', result)
      return { success: true, blog: result }
    } catch (error) {
      console.error('Update error in context:', error)
      return { success: false, error: error.message }
    }
  }

  const createComment = async (id, comment) => {
    try {
      const result = await addCommentMutation.mutateAsync({ id, comment })
      return { success: true, blog: result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await deleteBlogMutation.mutateAsync(blog)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return (
    <BlogContext.Provider
      value={{
        blogs,
        blogsLoading,
        blogsError,
        createBlog,
        updateBlog,
        createComment,
        deleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export const useBlog = () => {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider')
  }
  return context
}

export default BlogContext
