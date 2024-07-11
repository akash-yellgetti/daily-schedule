class Schedule {
  constructor(startTimeStr, elements) {
      let [hours, minutes] = startTimeStr.split(":").map(Number);
      this.startTime = new Date();
      this.startTime.setHours(hours, minutes, 0, 0);
      this.elements = elements;
  }

  addMinutes(startTime, minutes) {
      return new Date(startTime.getTime() + minutes * 60000);
  }

  calculateSchedule() {
      let schedule = [];
      let currentTime = new Date(this.startTime);
      this.elements.forEach(({ task, duration }) => {
          let endTime = this.addMinutes(currentTime, duration);
          schedule.push({ 
              task, 
              minutes: duration, 
              startTime: new Date(currentTime), 
              endTime: new Date(endTime) 
          });
          currentTime = endTime;
      });
      return schedule;
  }

  formatTime(date) {
      return date.toTimeString().slice(0, 5);
  }

  generateAndPrintSchedule() {
      let schedule = this.calculateSchedule();
      this.sortSchedule(schedule);
      this.printSchedule(schedule);
      return this.getCurrentActiveTask(schedule);
  }

  printSchedule(schedule) {
      let table = $('#scheduleTable').DataTable();
      table.clear();
      schedule.forEach(({ task, minutes, startTime, endTime }) => {
          if (!this.hasPassed(endTime)) {
              let isActive = this.isCurrentActive(startTime, endTime);
              let rowNode = table.row.add([
                  task,
                  minutes,
                  this.formatTime(startTime),
                  this.formatTime(endTime),
              ]).draw(false).node();
              if (isActive) {
                  $(rowNode).addClass('selected');
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
}

$(document).ready(function() {
  $('#scheduleTable').DataTable({
      ajax: {
          url: 'data.json',
          dataSrc: function(json) {
              let startTimeStr = json.startTime;
              let elements = json.elements;
              let mySchedule = new Schedule(startTimeStr, elements);
              let previousActiveTask = mySchedule.generateAndPrintSchedule();
              setInterval(() => {
                  let currentActiveTask = mySchedule.generateAndPrintSchedule();
                  if (currentActiveTask !== previousActiveTask) {
                      $('#scheduleTable').DataTable().ajax.reload();
                  }
              }, 60000);
              return [];
          }
      },
      columns: [
          { title: "Task", name: "task"},
          { title: "Duration (minutes)", name: "duration"},
          { title: "Start Time", name: "startTime"},
          { title: "End Time", name: "endTime"}
      ],
      // paging: false,
      // searching: false,
      // info: false,
      ordering: false
  });
});
