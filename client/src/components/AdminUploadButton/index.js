import React, { Component } from 'react';
import AdminModal from "../AdminModal";
import "./style.css";

// JSON validation
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

class AdminUploadButton extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            done: false,
            result: "Set my state first!"
        }

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    

    onClickHandler = event => {
        event.preventDefault();
        
        var file = this.props.selectedFile;
        var reader = new FileReader();
        var storyjson;
        var resultMessage = "state didnt set!";
        const formData = new FormData();
        
        formData.append('firstFile', this.props.selectedFile);

        reader.onload = function(e) {
            var text = reader.result;

            if(!isJsonString(text)){
                console.log("invalid json!");
            } else {
                console.log("valid json!");
                storyjson = JSON.parse(text);
                fetch("/api/seed/12345", {
                    method: 'POST',
                    body: text,
                    headers:{
                      'Content-Type': 'application/json'
                    }
                  }).then(response => { 
                      console.log('Success:', response);
                      this.setState({ result: "success!"})
                    })
                  .catch(error => { 
                      console.error('Error:', error);
                      resultMessage = "Error";
                    }
                );
            }
        }

        reader.readAsText(file);
        this.setState({ done: true, result: resultMessage });
    }

    render() {
        return (
            this.props.selectedFile ?
            // If selected file prop is not set, a disabled button will display
            <div>
                <button
                    id="upload-button" 
                    className="pure-button button-error"
                    onClick={ this.onClickHandler }>
                    Upload File to Database<br/>
                    <small>Please refer to documentation before using!</small>
                </button>
                <AdminModal header="Game Master Console" open={ this.state.done } >
                    { this.state.result }
                </AdminModal>
            </div>
            :
            <div>
                <button
                    id="upload-button" 
                    className="pure-button pure-botton" disabled>
                    Upload File to Database
                </button>
                <AdminModal header="Game Master Console" open={ this.state.done } >
                    { this.state.result }
                </AdminModal>
            </div>
    )};
};

export default AdminUploadButton;