import React from "react";
// import "react-step-progress-bar/styles.css";
// import { ProgressBar,Step } from "react-step-progress-bar"
import Steps, { Step } from "rc-steps";
import "rc-steps/assets/index.css";
import "rc-steps/assets/iconfont.css";
import { Loader } from './loader';
export function Stepper(props) {
    const styles = {
        width: '200px',
        display: 'inline-table',
        verticalAlign: 'top',
        textAlign: 'left'
      };
    return (
        <Steps  direction="vertical" style={styles} current={props.number} status={props.status}>
        <Step
          title={ props.number === 0  ? <Loader name="Registering"/> :"Registering"}
        > 
        </Step>
        <Step
          title={ props.number === 1  ? <Loader name="Pinning"/> :"Pinning"}
        />
        <Step title={ props.number === 2  ? <Loader name="Minting"/> : 'Minting'  } />
      </Steps>
        // <ProgressBar
        //     width="100%"
        //     percent={props.percent}
        //     filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
        // >
        //     <Step transition="scale">
        //         {({ accomplished }) => (
        //             <img
        //                 style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
        //                 width="30"
        //                 src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851"
        //             />
        //         )}
        //     </Step>
        //     <Step transition="scale">
        //         {({ accomplished }) => (
        //             <img
        //                 style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
        //                 width="30"
        //                 src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508"
        //             />
        //         )}
        //     </Step>
        //     <Step transition="scale">
        //         {({ accomplished }) => (
        //             <img
        //                 style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
        //                 width="30"
        //                 src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
        //             />
        //         )}
        //     </Step>
        // </ProgressBar>
    );
}
