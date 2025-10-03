import { Editor, Provider } from '../src'
import '../src/styles.less'

export const Example = () => {
  return <div>
    <h3>Example Component</h3>
    <div style={{ width: '800px', height: '600px' }}>
      <Provider>
        <Editor />
      </Provider>
    </div>
  </div>
}