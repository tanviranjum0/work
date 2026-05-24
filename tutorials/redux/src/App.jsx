import { useSelector } from "react-redux"
import Counter from "./components/Counter"
import Stats from "./components/Stats"
import { increment, decrement } from "./features/counters/counterSlice"
import { useDispatch } from "react-redux"
import Posts from "./components/Posts"

const App = () => {
  const counters = useSelector((state) => state.counters)
  const dispatch = useDispatch()
  const handleIncrement = (id) => {
    dispatch(increment(id))
  }
  const handleDecrement = (id) => {
    dispatch(decrement(id))
  }
  return (
    <div className="m-20">
      <div className="text-center text-4xl">Hello, Redux! Counter Component!</div>
      <div className="text-2xl">
        {counters.map(counter => <Counter key={counter.id} onDecrement={() => handleDecrement(counter.id)} onIncrement={() => handleIncrement(counter.id)} count={counter.count} />)}
        <Stats total={counters.reduce((sum, counter) => sum + counter.count, 0)} />
        <Posts />
      </div>
    </div>
  )
}

export default App
