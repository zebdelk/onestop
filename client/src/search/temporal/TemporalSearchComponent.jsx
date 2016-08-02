import React from 'react'
import { DateRange } from './TemporalActions'
import DayPicker, { DateUtils } from 'react-day-picker'
import styles from './temporal.css'
import moment from 'moment'

//const TemporalSearch = ({onChange, currentDate}) => {

const currentYear = (new Date()).getFullYear()
const fromMonth = new Date(currentYear - 100, 0, 1, 0, 0)
const toMonth = new Date()
// Component will receive date, locale
function YearMonthForm({ date, onChange }) {
  const months = moment.months()

  const years = []
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i++) {
    years.push(i)
  }

  const handleChange = function handleChange(e) {
    let { year, month } = e.target.form
    onChange(new Date(year.value, month.value))
  }

  return (
    <form className="DayPicker-Caption">
      <select name="month" onChange={ handleChange } value={ date.getMonth() }>
        { months.map((month, i) =>
          <option key={ i } value={ i }>
            { month }
          </option>)
        }
      </select>
      <select name="year" onChange={ handleChange } value={ date.getFullYear() }>
        { years.map((year, i) =>
          <option key={ i } value={ year }>
            { year }
          </option>)
        }
      </select>
    </form>
  )
}

class TemporalSearch extends React.Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    this.render = this.render.bind(this)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      from: null,
      to: null,
      initialMonth: toMonth
    }
  }

  handleDayClick(e, day) {
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
    console.log("Current range: " + JSON.stringify(range))
  }

  handleResetClick(e) {
    e.preventDefault()
    this.setState({
      from: null,
      to: null,
    })
  }

  render() {
    const { from, to } = this.state
    return (
      <div className="RangeExample">
        <DayPicker className={styles.dateComponent}
          ref="daypicker"
          onDayClick={ this.handleDayClick }
          initialMonth={ this.state.initialMonth }
          fromMonth={ fromMonth }
          toMonth={ toMonth }
          selectedDays={ day => DateUtils.isDayInRange(day, { from, to }) }
          captionElement={
            <YearMonthForm onChange={ initialMonth => this.setState({ initialMonth }) } />
          }
        />
      </div>
    )
  }
}

export default TemporalSearch
