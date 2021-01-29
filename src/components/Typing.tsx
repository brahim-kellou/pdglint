import React, { useEffect, useState } from 'react';
import { getKeystrokeHand, getDate, getTimestamp } from '../utils';
import fetchData from './fetchData';
import { randomText } from '../data';
import { PDGLINT_API_ENDPOINT } from '../config';
import { PrimaryButton, Spinner, SpinnerSize, ProgressIndicator } from '@fluentui/react';
import logo from '../logo.svg';
import './Typing.css';

interface Props {
}

const Typing: React.FC<Props> = () => {
  const [outgoingText, setOutgoingText] = useState<string>('');
  const [currentChar, setCurrentChar] = useState<string>(randomText.charAt(0));
  const [incomingText, setIncomingText] = useState<string>(randomText.substring(1));
  const [progress, setProgress] = useState<number>(0);
  const [isTypingEnd, setIsTypingEnd] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [dates, setDates] = useState<any[]>([]);
  const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
  const [isResultReady, setIsResultReady] = useState<boolean>(false);
  const [result, setResult] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keypress', onKeyPress);
      document.removeEventListener('keyup', onKeyUp);
    }
  });

  useEffect(() => {
    setProgress(
      outgoingText.length / randomText.length
    );
  }, [outgoingText])

  const onKeyPress = ({ key }: any) => {
    const hand = getKeystrokeHand(key)
    if (hand) {
      const date = new Date();
      setDates(dates.concat([date]));
      setData(data.concat([{
        Date: getDate(date),
        TS: getTimestamp(date),
        Hand: hand,
        HoldTime: 20,
        Direction: data.length > 0
          ? `${data[data.length - 1].Hand}${hand}`
          : null,
        LatencyTime: data.length > 0
          ? date.getTime() - dates[dates.length - 1].getTime()
          : null,
        FlightTime: data.length > 0
          ? date.getTime() - dates[dates.length - 1].getTime() - data[data.length - 1].HoldTime
          : null,
      }]));
    }
  }

  const onKeyUp = ({ key }: any) => {
    if (key === currentChar) {
      const date = new Date();
      setData(() => {
        if (data.length > 0) {
          data[data.length - 1] = {
            ...data[data.length - 1],
            HoldTime: date.getTime() - dates[dates.length - 1].getTime(),
          };
        }
        return data;
      });
      keystrokeLogger(key);
    }
  }

  const keystrokeLogger = (key: any) => {
    if (key === currentChar) {
      let updatedOutgoingText = outgoingText + currentChar;
      let updatedCurrentChar = incomingText.charAt(0)
      let updatedIncomingText = incomingText.substring(1)

      setOutgoingText(updatedOutgoingText);
      setCurrentChar(updatedCurrentChar);
      setIncomingText(updatedIncomingText);
    }
  };

  const handleOnSubmit = () => {
    setIsTypingEnd(true);
    setIsResultLoading(true);
    const url = PDGLINT_API_ENDPOINT;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(resp => {
        setTimeout(() => {
          setIsResultLoading(false);
          setIsResultReady(true);
          setResult(resp.result[0])
        }, 2000)
      });
  }

  const renderResponse = (result: boolean) => (
    result ?
      (
        <div>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke=" #f47c1f" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <line className="path line" fill="none" stroke=" #f47c1f" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
            <line className="path line" fill="none" stroke=" #f47c1f" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
          </svg>
          <h5 className="pd-detected">{`Parkinson disease detected !`}</h5>
        </div>
      )
      :
      (
        <div>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke="#09d3ac" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline className="path check" fill="none" stroke="#09d3ac" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
          </svg>
          <h5 className="pd-not-detected">{`You're safe! Parkinson disease not detected`}</h5>
        </div>
      )
  )

  return (
    <div className="container">
      {
        !isTypingEnd && (
          <div className="typing-container">
            <img src={logo} className="logo" alt="logo" />
            <div className="text-container">
              <p className="text">
                <span>{outgoingText}</span>
                <span className="current-char">{currentChar}</span>
                <span>{incomingText}</span>
              </p>
            </div>
            <div className="progress-container">
              <h5 className="progress-text">Progress: {(progress * 100).toFixed(2)} %</h5>
              <ProgressIndicator className="progress-indicator" percentComplete={progress} />
            </div>
            <div className="button-container">
              <PrimaryButton
                className="button"
                onClick={handleOnSubmit}
                disabled={isTypingEnd || (progress < 1)}
              >
                Start analyzing
              </PrimaryButton>
            </div>
          </div>
        )
      }
      {
        isResultLoading && (
          <div>
            <Spinner size={SpinnerSize.large} />
            <h5>Getting results ..</h5>
          </div>
        )
      }
      {
        isResultReady && (
          <div className="result-container">
            {renderResponse(result)}
          </div>
        )
      }
    </div>
  );
}

export default Typing;