import React from 'react';
import ReactDOM from 'react-dom';

function Hi() {
  return <div>
    hello world react project
  </div>
}

ReactDOM.render(<Hi/>, document.querySelector("#root"));
