import { useEffect, useState } from 'react';
import { PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react';
import './Typing.css';

const Typing = () => {
  const [isTypingEnd, setIsTypingEnd] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keypress', onKeyPress);
      document.removeEventListener('keyup', onKeyUp);
    }
  }, []);

  const onKeyPress = () => {

  }

  const onKeyUp = () => {

  }

  const handleOnSubmit = () => {
    setIsTypingEnd(true);
  }

  return (
    <div className="typing-container">
      <div>
        <p>
          <span>typed text - </span>
          <span>current char - </span>
          <span>upcoming text</span>
        </p>
      </div>
      <div>
        <PrimaryButton
          className="button"
          onClick={handleOnSubmit}
          disabled={isTypingEnd}
        >
          {isTypingEnd ? (
            <Spinner size={SpinnerSize.medium} />
          ) : (
              "Start analyzing"
            )}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default Typing;