import React, {useState, useEffect} from 'react'
import Timer from './Timer'
import {roundHalf} from '../../lib';

export default function CustomReader({
    audioEl,
    preview,
    textMap
}) {
    
    const [current, setCurrent] = useState(0);
    // const [highlighted, setHighlighted] = useState(null);
    const [player, setPlayer] = useState(null);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        // if(highlighted.current){
        //     highlighted.current.classList.add('highlighted');
        // }
  
        if(audioEl.current && !timer && !player){
            const timerCallback = () => {
                const newTime = roundHalf(audioEl.current.currentTime)
                setCurrent(newTime);
                if(newTime >= audioEl.current.duration){
                    newTimer.stop();
                }
                // console.log(newTime);
            }
            
            const newTimer = new Timer(timerCallback, 10);

            audioEl.current.addEventListener('ended', () => {
                newTimer.stop();
              });
              audioEl.current.addEventListener('pause', () => {
                // this.isPlaying = false;
                newTimer.stop();
                // audioEl.current.dispatchEvent(this._onPlayStateChange());
              });
              audioEl.current.addEventListener('play', () => {
                // this.isPlaying = true;
                newTimer.start();
                // this.player.dispatchEvent(this._onPlayStateChange());
              });

              setTimer(newTimer);
              setPlayer(audioEl.current);
        }
        
    }, [timer, audioEl, player, current])
    
    const exists = num => num !== undefined;
    
    const handleClick = (e, playhead) => {
        // console.log(`${e.target} clicked`);
        if (exists(playhead)) {
            // console.log(playhead);
            player.pause();
            player.currentTime = playhead;
            player.play();
            // console.log(player.currentTime);
        }

    }

    const highlightIt = (currentTime, playhead) => {

        // get the keys from this.times as an array and sort them from least to greatest
        var keys = textMap.filter(chunk => exists(chunk.playhead)).sort((a,b) => a.playhead-b.playhead).map(key => key.playhead);

        // determine the last key
        var isLastKey = key => key === keys[keys.length - 1];
    
        // find the key of the element to highlight
        var keyToHighlight= keys.find((key, i) => 
        
        // the current time should be greater than or equal to it
        currentTime >= key
    
        // the current time should also be less than the next key after it
        && currentTime < (isLastKey(key) ? player.duration : keys[i + 1]));

        return keyToHighlight ? keyToHighlight === playhead : false;

    }

    // const isHighlighted = playhead => {

    //     if(player.paused && player.currentTime === 0){
    //         return false;
    //     }
        
    // }

    const chunks = (data) => {

        let prevPlayhead = null;
        let prevPlayheadChildren = [];
        const isLastItem = i => i === textMap.length - 1; 
        
        const parentEl = ['p', null, textMap.reduce((acc, chunk, i) => {
            const el =  chunk.val === '\n' ? <br key={i}/> : <span key={i}  onClick={(e)=> handleClick(e, chunk.playhead)}>{chunk.val} </span>
            // nothing has been set, push it in as normal
            if(!exists(chunk.playhead) && !prevPlayhead){
                // console.log(`${i} nothing has been set, push it in as normal`);
                acc.push(el);
                return acc;
            }

            // the first playhead, reassign the 
            if(exists(chunk.playhead) && !prevPlayhead && !isLastItem(i)){
                // console.log(`${i} the first playhead, reassign the prevPlayhead`);
                prevPlayhead = children => (<span key={`data-playhead=` + chunk.playhead} className={highlightIt(current, chunk.playhead) ? 'highlighted' : null}  onClick={(e)=> handleClick(e, chunk.playhead)}>{chunk.val} {children.map(child => child)} </span>);
                return acc;
            }

            // there's no playhead but there is a previos; put it in the array to add to the previous

            if(!exists(chunk.playhead) && prevPlayhead && !isLastItem(i)){
                // console.log(`${i} // there's no playhead but there is a previos; put it in the array to add to the previous`);
                prevPlayheadChildren.push(el);
                return acc;
            }

            // there's a new playhead and there's also a previous, go ahead and push the old one; then reassign the prevPlayhead to the current element with a function
                        
            if(exists(chunk.playhead) && prevPlayhead && !isLastItem(i)){
                // console.log(`${i} // there's a new playhead and there's also a previous, go ahead and push the old one; then reassign the prevPlayhead to the current element with a function`);
                // process the last one
                acc.push(prevPlayhead(prevPlayheadChildren));
                prevPlayhead = prevPlayhead = children => (<span key={`data-playhead=` + chunk.playhead} className={highlightIt(current, chunk.playhead) ? 'highlighted' : null}  onClick={(e)=> handleClick(e, chunk.playhead)}>{chunk.val} {children.map(child => child)} </span>);
                prevPlayheadChildren = [];
                return acc;
            }

            // if it's the last item and it has a playhead

            if(exists(chunk.playhead) && isLastItem(i)){
                // console.log(`${i} if it's the last item and it has a playhead`);
                prevPlayhead = prevPlayhead = children => (<span key={`data-playhead=` + chunk.playhead} className={highlightIt(current, chunk.playhead) ? 'highlighted' : null} onClick={(e)=> handleClick(e, chunk.playhead)}>{chunk.val} {children.map(child => child)} </span>);
                acc.push(prevPlayhead(prevPlayheadChildren));
                prevPlayhead = null;
                prevPlayheadChildren = [];
                return acc;
            }

            // if it's the last item, and there's no playhead, add it as a child of the previousPlayhead

            if(!exists(chunk.playhead) && prevPlayhead && isLastItem(i)){
                // console.log(`${i} // if it's the last item, and there's no playhead, add it as a child of the previousPlayhead`);
                prevPlayheadChildren.push(el);
                acc.push(prevPlayhead(prevPlayheadChildren));
                prevPlayhead = null;
                prevPlayheadChildren = [];
                return acc;
            }

            return acc;

        } ,[])];

        return React.createElement(...parentEl);

    }

    return ( <div className = "readAloud" ref = {preview} style={{ position: 'relative', padding: '1em', lineHeight: 2, maxWidth: '30em', cursor: 'pointer'}}>{chunks(textMap)}</div>)
}