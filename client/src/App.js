import React, {Component, useState, useEffect} from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';

function NavBar() {
  return (
    <div className='navbar'>
      <div className='title'>Jack's blog</div>
      <button 
        className='home button-dark-background normalise-font-size' 
        onClick={() => {window.location.href='/'}}>
          Home
      </button>
      <button 
        className='new-post button-blue normalise-font-size' 
        onClick={() => {window.location.href='/newPost'}}>
          New post
      </button>
    </div>
  );
};

function Post(props) {
  const navigate = useNavigate();

  function handleEdit() {
    navigate('/editPost/' + props.id);
  }

  return (
    <div className='post-container'>
      <div className='title'>{props.title}</div>
      <div className='content'>{props.content}</div>
      <div className='bottom-bar-container'>
        <span className='date'>{props.dateCreated},</span>
        <span className='author'>posted by {props.author}</span>
        <button 
          className='edit-button button-dark-background' 
          onClick={handleEdit}>
            Edit
        </button>
      </div>
    </div>
  );
};

class PostParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: [],
      isLoading: true
    };
  };

  // fetch blog posts from server api endpoint
  componentDidMount() {
    fetch('/api/blogPosts')
      .then(response => response.json())
      .then(data => {this.setState({blogPosts: data})})
      .then(this.setState({isLoading: false}))
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <div>
          <div className='content-loading-text'>Content loading...</div>
          <div className='loading-spinner'></div>
        </div>
      )
    }
    return (
      <div className='post-parent'>
        {this.state.blogPosts.map((post) => {
          return <Post
            key={post._id}
            id={post._id}
            author={post.author}
            dateCreated={new Date(post.dateCreated).toLocaleDateString()}
            title={post.title}
            content={post.content} 
          />
        })}
      </div>
    );
  };
};

function CreateOrEditPost(props) {
  return (
    <div className='new-post-container'>
      <div className='header'>{props.title}</div>
      <form onSubmit={props.handleSubmit}>
        <div className='title'>
          <label htmlFor="title">Title: </label>
          <br/>
          <input 
            id='title' 
            type='text' 
            className='normalise-font-size' 
            name='title' 
            value={props.postTitle} 
            placeholder='Give your post a title.' 
            onChange={props.handleChange}/>
        </div>
        <div className='content'>
          <label htmlFor='content'>Content:</label>
          <br/>
          <textarea 
            id='content' 
            name='content' 
            className='normalise-font-size' 
            value={props.content} 
            placeholder='Write your post here.' 
            onChange={props.handleChange}/>
        </div>
        <div className='author'>
          <label htmlFor="author">Your name: </label>
          <br/>
          <input 
            id='author' 
            type='text' 
            className='normalise-font-size' 
            name='author' value={props.author} 
            placeholder="What's your name?" 
            onChange={props.handleChange}/>
        </div>
        <div className='bottom-bar'>
          <a 
            className='cancel-button button-dark-background normalise-font-size' 
            href='/'>
              Cancel
          </a>
          <button 
            className='submit-button button-blue normalise-font-size' 
            type='submit'>
              {props.submitButtonText}
          </button>
        </div>
      </form>
    </div>
  )
}

function CreatePost() {
  
  const [newPost, setNewPost] = useState({
    author: '',
    title: '',
    content: ''
  });

  const navigate = useNavigate();

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setNewPost((prevNewPost) => ({
      ...prevNewPost,
      [name]: value
    }));
  };

  function handleSubmit(event) {
    event.preventDefault();

    fetch('/api/newPost', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {'Content-Type': 'application/json'}
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error saving post.');
      }
    })
    .then(data => console.log('New document added: \n', data))
    .then(navigate('/'))
    .catch((error) => {
      throw new Error(error);
    });
  } 
  

  return (
    <CreateOrEditPost
      title='New post'
      submitButtonText='Create post'
      handleSubmit={handleSubmit}
      handleChange={handleChange}
    />
  )
  
}

function EditPost() {
  const navigate = useNavigate();

  const [Post, setPost] = useState({
    id: useParams().id,
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    fetch('/api/getPost/' + Post.id)
      .then(response => response.json())
      .then(data => {
        setPost({
          ...Post,
          title: data.title,
          author: data.author,
          content: data.content
        })
      });
  }, [Post.id]);

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value
    }));
  };

  function handleSubmit(event) {
    event.preventDefault();

    fetch('/api/editPost', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(Post)
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error updating post:', response);
      }
    })
    .then(data => console.log('Post updated: ', data))
    .then(navigate('/'))
    .catch(() => {throw new Error('Error saving post:')})
  }

  return (
    <CreateOrEditPost
      title='Edit post'
      submitButtonText='Save changes'
      content={Post.content}
      postTitle={Post.title}
      author={Post.author}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className='main'>
        <Routes>
          <Route path='/' element={<PostParent/>}/>
          <Route path='/newPost' element={<CreatePost/>}/>
          <Route path='/editPost/:id' element={<EditPost/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
