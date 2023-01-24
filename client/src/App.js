import React, {Component, useState} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

function NavBar() {
  return (
    <div className='navbar'>
      <div className='title'>Jack's blog</div>
      <button className='home button-dark-background' onClick={() => {window.location.href='/'}}>Home</button>
      <button className='new-post blue-button' onClick={() => {window.location.href='/newPost'}}>New post</button>
    </div>
  );
};

function Post(props) {
  return (
    <div className='post-container'>
      <div className='title'>{props.title}</div>
      <div className='content'>{props.content}</div>
      <div className='bottom-bar-container'>
        <span className='date'>{props.dateCreated},</span>
        <span className='author'>posted by {props.author}</span>
        <button className='edit-button button-dark-background'>Edit</button>
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
      .then(data => {
        console.log(data);
        this.setState({blogPosts: data});
      })
      .then(this.setState({isLoading: false}))
  }

  render() {
    if (this.state.isLoading == true) {
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

function NewPost() {
  
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
    .then((data) => {
      console.log('New document added: \n', data);
    })
    .then(navigate('/'))
    .catch((error) => {
      throw new Error(error);
    });
  } 
  

  return (
    <div className='new-post-container'>
      <div className='header'>New post</div>
      <form onSubmit={handleSubmit}>
        <div className='title'>
          <label htmlFor="title">Title: </label>
          <br/>
          <input id='title' type='text' name='title' placeholder='Give your post a title.' onChange={handleChange}/>
        </div>
        <div className='content'>
          <label htmlFor='content'>Content:</label>
          <br/>
          <textarea id='content' name='content' placeholder='Write your post here.' onChange={handleChange}/>
        </div>
        <div className='author'>
          <label htmlFor="author">Your name: </label>
          <br/>
          <input id='author' type='text' name='author' placeholder="What's your name?" onChange={handleChange}/>
        </div>
        <div className='submit'>
          <button id='submit' className='blue-button' type='submit'>Create post</button>
        </div>
      </form>
    </div>
  )
  
}

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className='main'>
        <Routes>
          <Route path='/' element={<PostParent/>}/>
          <Route path='/newPost' element={<><NewPost/><PostParent/></>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
