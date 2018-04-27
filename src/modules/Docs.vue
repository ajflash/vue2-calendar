<template>
  <div id="app">
    <div class="event-calendar--wrapper">
      <calendar
        class="event-calendar"
        v-model="value"
        :format="format"
        :clear-button="clear"
        :placeholder="placeholder"
        :pane="12"
        :has-input="false"
        :on-day-click="onDayClick3"
        :change-pane="changePane"
        :onDrawDate = "onDrawDate"
        ref="idCalendar"
      >
        <div class="event" :key="index" v-for="(evt, index) in events" :slot="evt.date" :style="{background:evt.bgFill}">
          <div class="event--text">
            <p class="text__line text__line--1">{{evt.contentLine1}}</p>
            <p class="text__line text__line--2">{{evt.contentLine2}}</p>
            <p class="text__line text__line--3">{{evt.contentLine3}}</p>
          </div>
          <i class="material-icons" :class="{mark : evt.mark}" v-if="evt.mark">
            <!-- label -->
            <!-- bookmark -->
          </i>
        </div>
      </calendar>
    </div>
    <form v-if="showDialog"
        class="formulario"
        action=""
        @submit.prevent="computeShowData(newEvent); showDialog = false"
      >
      <span>Dia:{{this.newEvent.date}}</span>
      <a @click.prevent="showDialog = false ;
        newEvent.contentLine1='' ;
        newEvent.contentLine2='' ;
        newEvent.contentLine3='';
        newEvent.mark = false" href="#">X</a>
      <br>
      <label for="text-01">texto 1</label>
      <input id="text-01" type="text" :value="newEvent.contentLine1">
      <br>
      <label for="text-02">texto 2</label>
      <input id="text-02" type="text" :value="newEvent.contentLine2">
      <br>
      <label for="text-03">texto 3</label>
      <input id="text-03" type="text" :value="newEvent.contentLine3">
      <br>
      <label for="mark"> mark </label>
      <input type="checkbox" id="mark" :value="newEvent.mark">
      <label for="outline"> outline </label>
      <input type="checkbox" id="outline" :value="newEvent.outline">
      <br>
      <input type="submit" value="enviar">
    </form>
  </div>
</template>
<script>

import Vue from 'vue'
import Calendar from 'components/Calendar'
export default {
  name: 'docs',
  data () {
    return {
      disabled: [],
      showDialog: false,
      showData: '',
      value: this.stringify(new Date()),
      newEvent: {
        date: '',
        contentLine1: '',
        contentLine2: '',
        contentLine3: '',
        bgFill: '',
        mark: 'false',
        outline: 'false'
      },
      events: [
        {
          date: '2018-01-01',
          contentLine1: 'text--1',
          contentLine2: 'text--2',
          contentLine3: 'text--3',
          bgFill: 'red',
          mark: true,
          outline: 'false'
        },
        {
          date: '2018-01-10',
          contentLine1: 'text 1',
          contentLine2: 'text 2',
          contentLine3: 'text 3',
          bgFill: 'blue',
          mark: true,
          outline: 'false'
        },
        {
          date: '2018-01-31',
          contentLine1: 'incidencia',
          contentLine2: 'médico',
          contentLine3: 'cambio',
          bgFill: 'gray',
          mark: true,
          outline: 'false'
        },
        {
          date: '2018-02-20',
          contentLine1: 'retraso',
          contentLine2: 'médico',
          contentLine3: 'cambio',
          bgFill: 'cian',
          mark: true,
          outline: 'false'
        },
        {
          date: '2018-03-14',
          contentLine1: 'info',
          contentLine2: 'médico',
          contentLine3: 'cambio',
          bgFill: 'none',
          mark: true,
          outline: 'false'
        },
        {
          date: '2018-03-15',
          contentLine1: 'vacaciones',
          contentLine2: 'médico',
          contentLine3: 'cambio',
          bgFill: 'none',
          mark: true,
          outline: 'false'
        }
      ],
      lurevents: [],
      format: 'yyyy-MM-dd',
      clear: true,
      isHoliday: true,
      placeholder: 'placeholder is displayed'
    }
  },
  components: {
    Calendar
  },
  created () {
    this.bus = new Vue()
    this.value = '2018-01-01'
  },
  mounted () {
    this.getEventContent()
  },
  computed: {
    _dateMap () {
      return this._createDateMap()
    }
  },
  methods: {
    getBus () {
      return this.bus
    },
    onDrawDate (e) {
      let date = e.date
      if (new Date().getTime() > date.getTime()) {
        e.allowSelect = true
      }
    },
    onDrawDate2 (e) {
      // console.info(e)
      // let date = e.date
      // if (new Date().getTime() > date.getTime()) {
      //   e.allowSelect = false
      // }
    },
    getDateInfo (v) {
      var iDiff = -1
      var sNowDate = this.stringify(new Date())
      var sDateName = ['今天', '明天', '后天']
      switch (true) {
        case v === sNowDate:
          iDiff = 0
          break
        case v === this.siblings(sNowDate, 1):
          iDiff = 1
          break
        case v === this.siblings(sNowDate, 2):
          iDiff = 2
          break
      }
      !this._dateMap && this.isHoliday && (this._dateMap = this._createDateMap())
      return (this._dateMap && this._dateMap[v]) || sDateName[iDiff]
    },
    _createDateMap () {
      var oTmp = {}
      for (var propety in this.HOLIDAYS) {
        var curHoliday = this.HOLIDAYS[propety]
        for (var i = 0; i < curHoliday.length; i++) {
          var sDate = curHoliday[i]
          var sName = this.DATENAME[propety]
          oTmp[sDate] = sName
        }
      }
      return oTmp
    },
    isDate (v) {
      if (v instanceof Date) {
        return true
      }
      return false
    },
    stringify (v) {
      if (!this.isDate(v)) return null
      return v.getFullYear() + '-' + this.filled(v.getMonth() * 1 + 1) + '-' + this.filled(v.getDate())
    },
    siblings (v, n) {
      var REG = /\d+/g
      v = v.match(REG)
      return this.stringify(new Date(v[0], v[1] - 1, v[2] * 1 + n * 1))
    },
    filled (v) {
      return String(v).replace(/^(\d)$/, '0$1')
    },
    onDayClick1 (date, str) {
      this.date1 = str
    },
    onDayClick2 (date, str) {
      this.date2 = this.getDateInfo(str) || str
    },
    onDayClick3 (date, str) {
      this.showDialog = true
      this.date3 = str
      let evt = this.events
      for (let i = 0; i < evt.length; i++) {
        if (str === evt[i].date) {
          this.newEvent = {
            bgFill: evt[i].bgFill,
            contentLine1: evt[i].contentLine1,
            contentLine2: evt[i].contentLine2,
            contentLine3: evt[i].contentLine3,
            date: str,
            mark: evt[i].mark,
            outline: evt[i].outline
          }
        }
      }
      // this.newEvent = {
      //   bgFill: this.newEvent.bgFill,
      //   contentLine1: this.newEvent.contentLine1,
      //   contentLine2: this.newEvent.contentLine2,
      //   contentLine3: this.newEvent.contentLine3,
      //   date: str,
      //   mark: false,
      //   outline: false
      // }
      var addDate = this.newEvent
      this.showData = this.computeShowData(addDate)
      // let calendar = this.$refs['idCalendar']
      // console.log(this.events)
    },
    computeShowData (addDate) {
      var dateCalendar = this.getEventContent()
      dateCalendar.push(addDate)
      return JSON.stringify(dateCalendar)
    },
    changePane (year, month, pane) {
      this.events = []
      // ajax data or ...
      setTimeout(() => {
        this.events = this.getEventContent(year, month, pane)
      }, 200)
    },
    onDayClick4 (date, str) {
      this.date4 = str
    },
    foramtDay (el) {
      /* eslint-disable */
      var S = "",
          J, I;
      if (el.lDay == 1) {
          S = "<b>" + (el.isLeap ? "\u95f0" : "") + el.lMonth + "\u6708" + (lunar.monthDays(el.lYear, el.lMonth) == 29 ? "\u5c0f" : "\u5927") + "</b>";
      } else {
          S = lunar.cDay(el.lDay);
      }
      I = el.lunarFestival;
      if (el.lMonth == "4" && I.indexOf("\u7aef\u5348\u8282") != -1) {
          I = "";
          el.lunarFestival = ""
      }
      if (I.length > 0) {
          if (I.length > 7) {
              // I = I.substr(0, 5) + "\u2026"
              I = I.split(' ')[0]
          }
          I = I.fontcolor("#909090");
      } else {
          // I = el.solarFestival;
          // if (I.length > 0) {
          //     J = (I.charCodeAt(0) > 0 && I.charCodeAt(0) < 128) ? 9 : 5;
          //     if (I.length > J + 1) {
          //         I = I.substr(0, J - 1) + "\u2026"
          //     }
          //     I = I.fontcolor("#909090");
          // } else {
          //     I = el.solarTerms;
          //     if (I.length > 0) {
          //         I = I.fontcolor("#ff7200") // 节日
          //     }
          // }
      }
      if (I.length > 0) {
          S = I
      }
      return S;
    },
    getDayCount (year, month) {
      const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if (month === 1) {
        if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
          return 29
        }
      }
      return dict[month]
    },
    random (min, max) {
      if (max == null) {
        max = min
        min = 0
      }
      return min + Math.floor(Math.random() * (max - min + 1))
    },
    getEventContent (year, month, pane) {
      const data = this.events
      // for (let p = 0; p < pane; p++) {
      //   let date = new Date(year, month + p)
      //   let monthCounts = this.getDayCount(date.getFullYear(), date.getMonth())
      //   for (let i = 1; i <= monthCounts; i++) {
      //     data.push({
      //       date: this.stringify(new Date(year, month + p, i)),
      //       content: 'texto', //this.random(100, 1000),
      //       low: this.random(1)
      //     })
      //   }
      // }
      return data
    }

  }
}
</script>


<style lang="scss">

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


.formulario {
  input {
    border : 1px solid gray;
  }
  a {
    background: red;
    color: white;
    position: absolute;
    top: 6px;
    right: 6px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 10px;
    border-radius: 50%;
    box-shadow:rgba(0,0,0,0.5) 1px 1px 2px 1px;
    transition: all 0.1s;
    &:hover {
      transition: all 0.1s;
      top: 7px;
      text-decoration: none;
      background: rgb(224, 0, 0);
      color: white;
      box-shadow:rgba(0,0,0,0.5) 0px 0px 2px 1px;
    }
  }
  position: relative;
  text-align: center;
  padding: 20px;
  width : 300px;
  height: auto;
  position: fixed;
  left: calc(50% - 150px);
  top: 100px;
  background: white;
  box-shadow:rgba(0,0,0,0.5) 1px 1px 2px 1px;
}

</style>
