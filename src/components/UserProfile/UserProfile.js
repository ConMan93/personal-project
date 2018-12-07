import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './UserProfile.css';
import ReactS3Uploader from 'react-s3-uploader';
import { updateUsername, userLoggedOut } from '../../redux/reducer';

class UserProfile extends Component {

    constructor() {
        super();

        this.state = {
            user: {},
            editing: false,
            uploading: false,
            userName: '',
            userImage: ''
        }
    }

    componentDidMount() {
        axios.get('/auth/currentuser').then( response => {
            
            this.setState({
                user: response.data,
                userName: response.data.username
            })
        })
    }

    handleChange = (input) => {
        this.setState({
            userName: input
        })
    }

    toggleEdit = () => {
        this.setState({
            editing: !this.state.editing
        })
    }

    toggleUpload = () => {
        this.setState({
            uploading: !this.state.uploading
        })
    }

    handleCancel = () => {
        this.setState({
            userName: this.state.user.username
        })
        this.toggleEdit()
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.updateUsername(this.state.userName)
        }
    }

    updateUsername = (username) => {
        let { id } = this.state.user
        axios.put('/api/updateusername', { username, id }).then( response => {
            
            this.props.updateUsername(response.data.username)
            this.setState({
                user: response.data,
                editing: false
            })
            this.componentDidMount()
        }).catch(error => {
            console.log(error)
        })
    }

    onFinish = (res) => {
        
        let { fileKey } = res
        let { id } = this.state.user
        let uploadedImage = `https://s3.us-west-1.amazonaws.com/profilepicturesdb/${fileKey}`

        axios.put('/api/updateimage', { uploadedImage, id}).then( response => {
            this.setState({
                user: response.data,
                uploading: false
            })
        })
    }

    userLoggedOut = () => {
        axios.get('/auth/logout').then( response => {
            this.props.userLoggedOut()
            this.props.history.push('/')
        })
    }

    render() {


        return (
            <div className='profile-form'>

                
                {this.state.uploading ?
                <div className='image-div uploading-true'>
                    <div></div>
                    <div>
                        <ReactS3Uploader
                        signingUrl="/s3/sign"
                        signingUrlMethod="GET"
                        accept="image/*"
                        s3path="pictures/"
                        preprocess={this.onUploadStart}
                        onSignedUrl={this.onSignedUrl}
                        onProgress={this.onProgress}
                        onError={this.onUploadError}
                        onFinish={this.onFinish}
                        signingUrlWithCredentials={ false }      // in case when need to pass authentication credentials via CORS
                        uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                        contentDisposition="auto"
                        scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/ig, '')}
                        inputRef={cmp => this.uploadInput = cmp}
                        autoUpload={true}
                        className='image-uploader'
                        />
                        <button onClick={this.toggleUpload} className='cancel-button'>Cancel</button>
                    </div>
                </div>
                :
                this.state.user.profileimage ?
                <div className='image-div'>
                    <img src={`${this.state.user.profileimage}`} alt='' className='user-image' />
                    <button onClick={this.toggleUpload} className='upload-button'>Upload new picture</button>
                </div>
                :
                <div className='image-div'>
                    <img src='https://www.gannett-cdn.com/-mm-/eb9153ef471ec1cb22faf645d7d063754d336115/c=0-330-2006-3000&r=2006x2670/local/-/media/USATODAY/test/2013/08/09/1376068652000-mmiin07p.jpg?width=534&height=712&fit=crop' alt='' className='user-image' />
                    <button onClick={this.toggleUpload} className='upload-button'>Upload new picture</button>
                </div>}
                

                <div className='profile-info'>
                    {this.state.editing ?
                    <div >
                        <div className='editing'>
                            <div>
                                <h2 className='profile-form-item'>Username: </h2>
                                <input onChange={e => this.handleChange(e.target.value)} value={this.state.userName} onKeyPress={this.handleKeyPress} className='edit-input' />
                            </div>
                            <div>
                                <button onClick={() => this.updateUsername(this.state.userName)} className='update-button'>Save</button>
                                <button onClick={this.handleCancel} className='update-button'>Cancel</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='not-editing'>
                        <div>
                            <h2 className='profile-form-item'>Username: </h2>
                            <h3 className='profile-form-item'>{this.state.user.username}</h3>
                        </div>
                        <button className='edit-button' onClick={this.toggleEdit}><i className="fas fa-edit"></i></button>
                    </div>}
                </div>

                <div className='profile-info'>
                    <div>
                        <h2 className='profile-form-item'>Email: </h2>
                        <h3 className='profile-form-item'>{this.state.user.email}</h3>
                    </div>
                </div>



                <button className='logout-button mobile-logout-button' onClick={this.userLoggedOut}>Log out</button>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { updateUsername, userLoggedOut })(UserProfile)