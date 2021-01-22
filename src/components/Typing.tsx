import { useEffect, useState } from 'react';
import { getKeystrokeHand, getDate, getTimestamp } from '../utils';
import { randomText } from '../data';
import { PDGLINT_API_ENDPOINT } from '../config';
import { DefaultButton, Spinner, SpinnerSize, ProgressIndicator } from '@fluentui/react';
import './Typing.css';

const Typing = () => {
  const [outgoingText, setOutgoingText] = useState<string>('');
  const [currentChar, setCurrentChar] = useState<string>(randomText.charAt(0));
  const [incomingText, setIncomingText] = useState<string>(randomText.substring(1));
  const [progress, setProgress] = useState<number>(0);
  const [isTypingEnd, setIsTypingEnd] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [dates, setDates] = useState<any[]>([]);

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
      setOutgoingText(outgoingText + currentChar);

      setCurrentChar(incomingText.charAt(0));

      setIncomingText(incomingText.substring(1));
    }
  };

  const handleOnSubmit = () => {
    setIsTypingEnd(true);
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
        console.log(resp.result[0])
      });
  }

  return (
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
        <DefaultButton
          className="button"
          onClick={handleOnSubmit}
          disabled={isTypingEnd || (progress < 1)}
        >
          {isTypingEnd ? (
            <Spinner size={SpinnerSize.medium} />
          ) : (
              "Start analyzing"
            )}
        </DefaultButton>
      </div>
    </div>
  );
}

export default Typing;