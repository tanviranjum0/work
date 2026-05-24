import Counter from "./components/Counter"
import Stats from "./components/Stats"
import { useState } from "react"
const initialCounters = [
  {
    id: 1,
    count: 0
  },
  {
    id: 2,
    count: 0
  }
]
const App = () => {

  const [counters, setCounters] = useState(initialCounters)
  const handleIncrement = (id) => {
    setCounters(counters.map(counter => counter.id === id ? { ...counter, count: counter.count + 1 } : counter));
  }
  const handleDecrement = (id) => {
    setCounters(counters.map(counter => counter.id === id ? { ...counter, count: counter.count - 1 } : counter));
  }
  return (
    <div className="m-20">
      <div className="text-center text-4xl">Hello, Redux! Counter Component!</div>
      <div className="text-2xl">
        {counters.map(counter => <Counter key={counter.id} onDecrement={() => handleDecrement(counter.id)} onIncrement={() => handleIncrement(counter.id)} count={counter.count} />)}
        <Stats total={counters.reduce((sum, counter) => sum + counter.count, 0)} />
      </div>
    </div>
  )
}

export default App
