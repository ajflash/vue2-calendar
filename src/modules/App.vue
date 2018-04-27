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
        :onDrawDate = "onDrawDate"
        ref="idCalendar"
      >


        <div class="event" style="background-color : red" :key="index" v-for="(evt, index) in events" :slot="evt.date" :style="{background:evt.bgFill}">
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
        newEvent.mark = false;
        newEvent.bgFill = ''
      " href="#">X</a>
      <br>
      <label for="text-01">texto 1</label>
      <input id="text-01" type="text" v-model="newEvent.contentLine1">
      <br>
      <label for="text-02">texto 2</label>
      <input id="text-02" type="text" v-model="newEvent.contentLine2">
      <br>
      <label for="text-03">texto 3</label>
      <input id="text-03" type="text" v-model="newEvent.contentLine3">
      <br>
      <label for="bgFill">Color</label>
      <input id="bgFill" type="text" v-model="newEvent.bgFill">
      <br>
      <label for="mark"> mark </label>
      <input type="checkbox" id="mark" v-model="newEvent.mark">
      <label for="outline"> outline </label>
      <input type="checkbox" id="outline" v-model="newEvent.outline">
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
      // value: this.stringify(new Date()),
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
      // lurevents: [],
      format: 'yyyy-MM-dd',
      clear: true,
      isHoliday: true,
      holiday: ['2018-01-01', '2018-01-02', '2018-01-03'],
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
    filled (v) {
      return String(v).replace(/^(\d)$/, '0$1')
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
          console.log(evt[i])
        }
      }
      this.newEvent = {
        bgFill: this.newEvent.bgFill,
        contentLine1: this.newEvent.contentLine1,
        contentLine2: this.newEvent.contentLine2,
        contentLine3: this.newEvent.contentLine3,
        date: str,
        mark: false,
        outline: false
      }
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
    getEventContent (year, month, pane) {
      const data = this.events
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
.lorem{
  // visibility: hidden;
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
