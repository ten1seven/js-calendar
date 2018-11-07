export default class Calendar {
  constructor(elem) {
    this.elem = elem

    this.setVariables()
    this.renderCalendar()
    this.bindEvents()
  }

  /*
   * variables
   */

  setVariables() {
    // week starts on (for i18n)
    this.weekStarts = parseInt(this.elem.dataset.weekStarts, 10) || 0

    // default month list (for i18n)
    this.months = window.dcMonthList || [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    // default day list (for i18n)
    // weekdays always start with Sunday in the `0` position
    this.days = window.dcDayList || [
      { abbr: 'S', day: 'Sunday' },
      { abbr: 'M', day: 'Monday' },
      { abbr: 'T', day: 'Tuesday' },
      { abbr: 'W', day: 'Wednesday' },
      { abbr: 'T', day: 'Thursday' },
      { abbr: 'F', day: 'Friday' },
      { abbr: 'S', day: 'Saturday' }
    ]

    // shift days for calendars that don't start weeks on Sunday
    for (let i = 0; i < this.weekStarts; i++) {
      this.days.push(this.days.shift())
    }

    // create a date object to hold the current date
    this.today = new Date()

    // default event list
    this.eventList = window.dcEventList || []

    // get language translations
    this.language = this.elem.dataset.language
      ? JSON.parse(this.elem.dataset.language)
      : {
          prev: 'Previous Month',
          next: 'Next Month'
        }

    // get month to display or use current
    this.month = this.elem.dataset.month
      ? this.elem.dataset.month
      : new Date().getMonth() + 1

    // get year to display or use current
    this.year = this.elem.dataset.year
      ? this.elem.dataset.year
      : new Date().getFullYear()

    // get selected day if it exists
    this.day = Number.isInteger(parseInt(this.elem.dataset.day, 10))
      ? this.elem.dataset.day
      : null

    // get aria live region (has to be in the dom at page load)
    this.ariaLive = this.elem.querySelector('[aria-live]')
  }

  /*
   * calendar
   */

  renderCalendar() {
    // create `table`, `caption`, `thead`, and `tbody` containers
    this.calendar = document.createElement('table')
    this.calendar.classList.add('calendar')

    this.calHeading = document.createElement('caption')
    this.calHeading.classList.add('calender__caption')

    this.calHead = document.createElement('thead')
    this.calBody = document.createElement('tbody')

    // append containers to calendar
    this.calendar.appendChild(this.calHeading)
    this.calendar.appendChild(this.calHead)
    this.calendar.appendChild(this.calBody)

    // do all of the initial rendering
    this.renderCaption()
    this.renderHead()
    this.renderDays()

    // append to container after all the work is done
    this.elem.appendChild(this.calendar)
  }

  renderCaption() {
    // the `caption` element can't be display:flex so an additional wrapper is necessary
    let wrapper = document.createElement('div')

    this.prevMonth = this.renderButton(
      'calendar__prev',
      'prev',
      this.language.prev
    )

    this.nextMonth = this.renderButton(
      'calendar__next',
      'next',
      this.language.next
    )

    this.headingText = document.createElement('span')
    this.headingText.classList.add('calender__caption__text')
    this.setCaptionText()

    wrapper.appendChild(this.prevMonth)
    wrapper.appendChild(this.headingText)
    wrapper.appendChild(this.nextMonth)

    this.calHeading.appendChild(wrapper)
  }

  renderButton(cssClass, action, label) {
    let button = document.createElement('button')
    button.classList.add(cssClass)
    button.dataset.action = action
    button.setAttribute('aria-label', label)

    return button
  }

  setCaptionText() {
    this.headingText.textContent = `${this.months[this.month - 1]} ${this.year}`
  }

  renderHead() {
    let strOut = '<tr>'

    this.days.forEach(function(day) {
      strOut += `<th scope="col" class="calendar__weekday"><span aria-label="${
        day.day
      }">${day.abbr}</span></th>`
    })

    strOut += '</tr>'

    this.calHead.innerHTML = strOut
  }

  renderDays() {
    // set initial counters
    let currDay = 1
    let nextDay = 1

    // make date calculates
    let numDaysCurrMonth = this.daysInMonth(this.year, this.month)
    let numDaysPrevMonth = this.daysInMonth(this.year, this.month - 1)
    let firstDayOfWeek = this.dayOfWeek(this.year, this.month, 1)
    let numWeeksCurrMonth = Math.ceil((numDaysCurrMonth + firstDayOfWeek) / 7)

    // create `URLSearchParams` instance from current url
    let queryString = new URLSearchParams(window.location.search)

    // create empty string
    let calBodyStr = ''

    // loop over number of weeks in this month
    for (let w = 0; w < numWeeksCurrMonth; w++) {
      calBodyStr += `<tr>`

      // loop over 7 days
      for (let d = 0; d < 7; d++) {
        // current day as string to compare
        let currDayStr = `${this.year}-${this.month}-${currDay}`

        // selected day as a string to compare
        let selectedDayStr = `${this.year}-${this.month}-${this.day}`

        // today's date converted to string to compare
        let todayStr = `${this.today.getFullYear()}-${this.today.getMonth() +
          1}-${this.today.getDate()}`

        calBodyStr += `<td class="calendar__day">`

        if (w === 0 && d < firstDayOfWeek) {
          // back-fill days from last month
          let prevDay = numDaysPrevMonth - firstDayOfWeek + d + 1
          calBodyStr += this.returnDayNum(prevDay, '-lastmonth')
        } else if (currDay > numDaysCurrMonth) {
          // front-fill days for next month
          calBodyStr += this.returnDayNum(nextDay, '-nextmonth')
          nextDay++
        } else {
          if (this.eventList && this.eventList.indexOf(currDayStr) >= 0) {
            // create empty URLSearchParams instance for this link's href
            let newQueryString = new URLSearchParams()
            if (queryString.has('chp_chapter_number')) {
              newQueryString.set(
                'chp_chapter_number',
                queryString.get('chp_chapter_number')
              )
            }

            newQueryString.set('date', currDayStr)

            // display that there is at least one event on this day
            let cssClasses = ''
            cssClasses += todayStr === currDayStr ? ' -today' : ''
            cssClasses += selectedDayStr === currDayStr ? ' -selected' : ''

            calBodyStr += `<a href="${location.href.split('?')[0] +
              '?' +
              newQueryString.toString()}" class="calendar__day__number -upcoming ${cssClasses}">${currDay}</a>`
          } else if (todayStr === currDayStr) {
            // display that this is today
            calBodyStr += this.returnDayNum(currDay, '-today')
          } else {
            // this is an uneventful day
            calBodyStr += this.returnDayNum(currDay)
          }
          currDay++
        }
        calBodyStr += `</td>`
      }
      calBodyStr += `</tr>`
    }

    this.calBody.innerHTML = calBodyStr
  }

  /*
   * events
   */

  bindEvents() {
    this.prevMonth.addEventListener('click', this.changeMonth.bind(this))
    this.nextMonth.addEventListener('click', this.changeMonth.bind(this))
  }

  changeMonth(event) {
    event.preventDefault()

    let monthModifier = event.currentTarget.dataset.action === 'next' ? 1 : -1
    let nextMonth = new Date(
      this.year,
      parseInt(this.month, 10) + monthModifier,
      0
    )

    this.month = nextMonth.getMonth() + 1
    this.year = nextMonth.getFullYear()

    this.setCaptionText()
    this.renderDays()

    this.ariaLive.textContent = `${this.months[this.month - 1]} ${this.year}`
  }

  /*
   * utilities
   */

  returnDayNum(dayNum, classes) {
    return `<div class="calendar__day__number ${classes}">${dayNum}</div>`
  }

  daysInMonth(year, month) {
    return new Date(year, month, 0).getDate()
  }

  dayOfWeek(year, month, day) {
    return new Date(`${month}/${day}/${year}`).getDay() - this.weekStarts
  }
}
