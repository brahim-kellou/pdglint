import React, { useEffect, useState } from 'react';
import { getKeystrokeHand, getDate, getTimestamp } from '../utils';
import { randomText } from '../data';
import { PDGLINT_API_ENDPOINT } from '../config';
import { PrimaryButton, Spinner, SpinnerSize, ProgressIndicator } from '@fluentui/react';
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
  const [result, setResult] = useState<boolean>(false);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);
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
        setIsResult(true);
        setResult(resp.result[0])
        setIsLoading(false);
      });
  }

  return (
    <div className="container">
      {
        !isTypingEnd && (
          <div className="typing-container">
            <div className="text-container">
              <p>
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
        isLoading && (
          <div>
            <Spinner size={SpinnerSize.large} />
          </div>
        )
      }
      {
        isResult && (
          <div className="result-container">
            <h1>{String(result)}</h1>
          </div>
        )
      }
    </div>
  );
}

export default Typing;