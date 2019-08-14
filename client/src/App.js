import React, { Component } from "react";
import API from "./utils/API";
import Register from "./components/Register"
import Story from "./components/Story"


class App extends Component {

  state = {
    data: []
  }

  componentDidMount() {
    API.getFullStory().then(res => {
      this.setState({
        data: res.data
      },()=>console.log(this.state.data))
    })
  }

  render() {
    return (
      <div className="App">
        <Register />
        {this.state.data.map(story => (
          <Story
            // props here
            // function for story flow?
            id={story.id}
            crntScene={story.scene_title}
            text={story.scene_text}
            nxtScene={story.next_scene}
            crctChoice={story.correct_choice}
            choice_a={story.choice_a}
            choice_b={story.choice_b}
            wrongChoiceText={story.wrong_choice_result}
          />
        ))}
        
      </div>
        
    );
  }
}

export default App;
