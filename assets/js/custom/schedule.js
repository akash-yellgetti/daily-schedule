class Schedule {
  constructor(startTimeStr, elements) {
    // let [hours, minutes] = startTimeStr.split(":").map(Number);
    // this.startTime = new Date();
    // this.startTime.setHours(hours, minutes, 0, 0);
    this.startTime = this.resetTime(startTimeStr);
    this.elements = elements;
    this.foodEvents = []; // Track food events
  }

  addMinutes(startTime, minutes) {
    return new Date(startTime.getTime() + minutes * 60000);
  }

  resetTime(startTimeStr) {
    let [hours, minutes] = startTimeStr.split(":").map(Number);
    const obj = new Date();
    obj.setHours(hours, minutes, 0, 0);
    return obj;
  }

  getTimeDifferenceInMinutes(startTime) {
    // Ensure startTime is a Date object
    if (!(startTime instanceof Date)) {
      throw new Error("startTime must be a Date object.");
    }
  
    // Get the current time
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Calculate the difference in milliseconds
    let timeDifferenceMs = now - startTime;
    
    // Convert milliseconds to minutes
    let timeDifferenceMinutes = Math.floor(timeDifferenceMs / 60000);
    
    return Math.abs(timeDifferenceMinutes);
  }

  calculateSchedule() {
    let schedule = [];
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
    let sleepTimeMinutes = this.getTimeDifferenceInMinutes(this.startTime);
    // Add sleep time as the first event
    if (sleepTimeMinutes > 0) {
      let sleepEndTime = this.addMinutes(currentTime, sleepTimeMinutes);
      schedule.push({
        title: "Sleep",
        description: `Sleep period (${sleepTimeMinutes} minutes)`,
        minutes: sleepTimeMinutes,
        type: "Sleep",
        startTime: new Date(currentTime),
        endTime: new Date(sleepEndTime),
      });
      currentTime = sleepEndTime;
    }

    this.elements.forEach(({ title, description, startTime = null, duration, type = null }) => {
      currentTime = startTime ? this.resetTime(startTime) : currentTime;
      let endTime = this.addMinutes(currentTime, duration);
      let event = {
        title,
        description,
        minutes: duration,
        type,
        startTime: new Date(currentTime),
        endTime: new Date(endTime),
      };

      schedule.push(event);

      if (type === "Food") {
        this.foodEvents.push(event);
      }

      currentTime = endTime;
    });

    console.log(schedule);
    return schedule;
  }

  formatTime(date) {
    return date.toTimeString().slice(0, 5);
  }

  generateAndPrintSchedule() {
    let schedule = this.calculateSchedule();
    // this.sortSchedule(schedule);
    this.printSchedule(schedule);
    return this.getCurrentActiveTask(schedule);
  }

  printSchedule(schedule) {
    let table = $("#scheduleTable").DataTable();
    table.clear();
    schedule.forEach(({ title, description, minutes, type, startTime, endTime }) => {
      if (!this.hasPassed(endTime)) {
        let isActive = this.isCurrentActive(startTime, endTime);
        let rowNode = table.row
          .add([
            this.formatTime(startTime),
            this.formatTime(endTime),
            minutes,
            type,
            title,
            description,
            
          ])
          .draw(false)
          .node();
        if (isActive) {
          $(rowNode).addClass("selected");
        }
      }
    });
  }

  getCurrentActiveTask(schedule) {
    let now = new Date();
    for (let i = 0; i < schedule.length; i++) {
      let { startTime, endTime } = schedule[i];
      if (now >= startTime && now <= endTime) {
        return i;
      }
    }
    return -1;
  }

  isCurrentActive(startTime, endTime) {
    let now = new Date();
    return now >= startTime && now <= endTime;
  }

  hasPassed(endTime) {
    let now = new Date();
    return false;
    return now > endTime;
  }

  sortSchedule(schedule) {
    let now = new Date();
    schedule.sort((a, b) => {
      if (this.isCurrentActive(a.startTime, a.endTime)) return -1;
      if (this.isCurrentActive(b.startTime, b.endTime)) return 1;
      if (now > a.endTime && now > b.endTime) return 0;
      if (now > a.endTime) return 1;
      if (now > b.endTime) return -1;
      return a.startTime - b.startTime;
    });
  }

  getFoodTimeDifference() {
    if (this.foodEvents.length < 2) {
      return "Not enough food events to calculate the time difference.";
    }
    let firstFood = this.foodEvents[0];
    let lastFood = this.foodEvents[this.foodEvents.length - 1];

    let diffMs = lastFood.startTime - firstFood.startTime;
    let diffHours = diffMs / 3600000; // Convert milliseconds to hours
    
    return diffHours.toFixed(2) + " hours";
  }

  getTotalTime() {
    let totalTime = 0;
    this.calculateSchedule().forEach(({ minutes }) => {
      totalTime += minutes;
    });
    return (totalTime/60);
    console.log(totalTime);
  }
}


$(document).ready(function () {
  $("#scheduleTable").DataTable({
    // dom: 'lBfrtip',
    
    layout: {
        topStart: {
            buttons: [
                'pageLength',
                {
                  extend: 'csv',
                  split: ['excelHtml5', 'csvHtml5', 'copyHtml5', 'pdfHtml5']
                }
            ]
        }
    },
    ajax: {
      url: "../../assets/json/new-routine.json",
      dataSrc: function (json) {
        let startTimeStr = json.startTime;
        let elements = json.elements;
        let mySchedule = new Schedule(startTimeStr, elements);
        let previousActiveTask = mySchedule.generateAndPrintSchedule();
        let lastMinute = new Date().getMinutes();
        setInterval(() => {
          const currentMinute = new Date().getMinutes();

          if (currentMinute !== lastMinute) {
            lastMinute = currentMinute;
            let currentActiveTask = mySchedule.generateAndPrintSchedule();
            if (currentActiveTask !== previousActiveTask) {
              $("#scheduleTable").DataTable().ajax.reload();
            }
          }
          
        }, 60000);
        $('#mySpan').text('Total Hours: ' + mySchedule.getTotalTime());
        return [];
      },
    },
    lengthMenu: [
      [  50, 30, 20, 10, -1],
      [  50, 30, 20, 10, "All"],
    ],
    columns: [
      { title: "Start Time", name: "startTime" , width: "6%"},
      { title: "End Time", name: "endTime" , width: "6%"},
      { title: "minutes", name: "duration", width: "3%"},
      { title: "Type", name: "type" , width: "6%"},
      { title: "Title", name: "title", width: "8%" },
      { title: "Description", name: "description", width: "40%" },
      
    ],
    // paging: false,
    // searching: false,
    // info: false,
    ordering: false,
  });
});
