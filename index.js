const {render} = ReactDOM;
const {connect, Provider} = ReactRedux;
const {createStore, combineReducers} = Redux;

const padList = [
  {
    key: "Q",
    dsp: "Heater-1",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  }, {
    key: "W",
    dsp: "Heater-2",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  }, {
    key: "E",
    dsp: "Heater-3",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  }, {
    key: "A",
    dsp: "Heater-4",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  }, {
    key: "S",
    dsp: "Clap",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  }, {
    key: "D",
    dsp: "Open-HH",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  }, {
    key: "Z",
    dsp: "Kick-HH",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  }, {
    key: "X",
    dsp: "Kick",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  }, {
    key: "C",
    dsp: "Closed-HH",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];

const UPDATE = "UPDATE";

const updateKey = (keyDSP) => {
  return ({type: UPDATE, keyDSP})
}

const keyReducer = (state = "Press a Key", action) => {
  switch (action.type) {
    case UPDATE:
      return action.keyDSP;
    default:
      return state;
  }
}

const store = createStore(keyReducer);

let Machine = () => {
  let pads = padList.map((el, idx) => <Pad key={idx} dsp={el.dsp} keyTxt={el.key} url={el.url}/>)
  return (<div id="drum-machine" className="machine">
    <Display/> {pads}</div>)
}

let Pad = ({dsp, keyTxt, url, updateKey}) => {
  let aud;
  function handleClick(e) {
    aud.play();
    updateKey(dsp);
  }
  return (<div id={dsp} onClick={handleClick} className="drum-pad">
    <div className="pad-txt">{keyTxt}</div>
    <audio src={url} className="clip" id={keyTxt} ref={node => {
        aud = node
      }}></audio>
  </div>)
}

let Display = ({keyDSP}) => {
  return (<div id="display" className="display">{keyDSP}</div>)
}

const MapStateToProps = (state) => {
  return ({keyDSP: state})
}

const MapDispatchToProps = (dispatch) => ({
  updateKey: (keyDSP) => dispatch(updateKey(keyDSP))
})

Display = connect(MapStateToProps)(Display)
Pad = connect(null, MapDispatchToProps)(Pad)
class OContC extends React.Component {
  constructor(props) {
    super(props)
    this.handleKey = this.handleKey.bind(this);
    this.inter = null;
  }

  handleKey(e) {
    let keyC;
    if (e.hasOwnProperty("keyCode")) {
      keyC = String.fromCharCode(e.keyCode)
    } else {
      keyC = e.key.toUpperCase();
    }
    for (let i = 0; i < padList.length; i++) {
      if (keyC.toUpperCase() === padList[i].key) {
        let ele = document.getElementById(keyC);
        ele.pause();
        ele.currentTime = 0;
        ele.play();
        this.props.updateKey(padList[i].dsp)
        ele.parentNode.classList.add("pressed");
        setTimeout(this.inter)
        this.inter = setTimeout(() => {
          ele.parentNode.classList.remove("pressed");
        }, 200)
        return;
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKey)
  }

  render() {
    return (<div className="drumMachine">
      <Machine></Machine>
    </div>)
  }

}

const OCont = connect(null, MapDispatchToProps)(OContC)

class AppWrapper extends React.Component {
  render() {
    return (<Provider store={store}>
      <OCont/>
    </Provider>)
  }
}

render(<AppWrapper/>, document.getElementById('app'))
