import React, { useEffect } from 'react';

const Typing = () => {

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

  return (
    <div>
      <div>
        <p>
          <span>typed text</span>
          <span>current char</span>
          <span>upcoming text</span>
        </p>
      </div>
      <div>

      </div>
    </div>
  );
}

export default Typing;