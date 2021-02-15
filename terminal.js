// terminal command functions

cursors = ["▮", "▯", "▕", "▌", "▁", "░", "▒", "█"];

window.terminalvars = {};

clear = (t) => {
  t.displayelem.innerHTML = "";
  t.pastbuff = t.prompt;
  t.ibuff = [];
};

date = (t) => {
  t.print(new Date().toISOString());
};

help = (t) => {
  t.print(`
    <pre>
    ${Object.keys(t.functions).sort()}
    </pre>
  `);
};

getIP = (json) => {
  console.log("json", json);
  window.myip_const = json.ip;
  window.terminalvars.ip = json.ip;
  t.print(json.ip);
};

whatismyip = (t) => {
  const s = document.createElement("script");
  s.src = "https://api.ipify.org/?format=jsonp&callback=getIP";
  document.body.appendChild(s);
  document.body.removeChild(s);
};

weather = (t, location = "") => {
  fetch(`http://wttr.in/${location}?format=4`)
    .then((res) => res.text())
    .then((data) => t.print(data));
};

terminalfunctions = {
  clear,
  cls: clear,
  date,
  help,
  weather,
  whatismyip,
};

// Initial config
const config = {
  terminal: "#display",
  input: "#input",
  prompt: "<b class='prompt'>root:~$ </b>",
  cursor: cursors[3],
  cursorspeed: 10,
  unknown_command_text: "Unknown command",
  functions: terminalfunctions,
};

// Terminal class
class Terminal {
  constructor(config) {
    this.config = config;
    this.pastbuff = "";
    this.ibuff = [];
    this.readonly = false;

    // initial configuration
    this.displayelem = document.querySelector(config.terminal);
    this.clielem = document.querySelector(config.input);
    this.prompt = config.prompt;
    this.cursor = `<span class='cursor'>${config.cursor}</span>`; // cursor element
    this.unknowncommand = config.unknown_command_text;
    this.linebreak = "<br />";
    this.linebreaks = "<br /><br />";
    this.cursorSpeed = config.cursorspeed;
    this.functions = config.functions;
  }

  keybindings = {
    Backspace: () => {
      this.ibuff = this.ibuff.splice(0, this.ibuff.length - 1);
    },
    Enter: () => {
      const input = this.ibuff.join("").split("&nbsp;")[0];
      const param = this.ibuff.join("").split("&nbsp;")[1];
      if (Object.keys(this.functions).includes(input)) {
        this.functions[input](this, param);
      } else if (this.ibuff.length < 1) {
        this.freeze();
        this.nbspline();
      } else {
        this.pastbuff += this.ibuff
          .join("")
          .concat(
            this.linebreak,
            this.unknowncommand,
            " '",
            this.ibuff.join(""),
            "'",
            this.linebreaks,
            this.prompt
          );
      }
      this.ibuff = [];
      window.scrollTo(0, document.body.scrollHeight);
    },
    AltLeft: () => false,
    AltRight: () => false,
    ShiftLeft: () => false,
    ShiftRight: () => false,
    ControlLeft: () => false,
    ControlRight: () => false,
    ArrowUp: () => false,
    ArrowDown: () => false,
    ArrowLeft: () => false,
    ArrowRight: () => false,
    F1: () => false,
    F2: () => false,
    F3: () => false,
    F4: () => false,
    F5: () => false,
    F6: () => false,
    F7: () => false,
    F8: () => false,
    F9: () => false,
    F10: () => false,
    F11: () => false,
    F12: () => false,
    Escape: () => false,
    Insert: () => false,
    Delete: () => false,
    Home: () => false,
    End: () => false,
    PageUp: () => false,
    PageDown: () => false,
    CapsLock: () => false,
    Tab: () => false,
    MetaLeft: () => false,
    MetaRight: () => false,
    Pause: () => false,
    ScrollLock: () => false,
    Meta: () => false,
  };

  // render buffer contents to the display
  render = () =>
    (this.clielem.innerHTML = `${this.pastbuff}${this.ibuff.join("")}${
      this.cursor
    }`);
  freeze = () => {
    this.displayelem.innerHTML += `${this.pastbuff}${this.linebreak}`;
    this.pastbuff = "";
    this.ibuff = [];
  };

  nbspline = () => (this.pastbuff += this.ibuff.join("").concat(this.prompt));

  print = (buff) => {
    buff = buff ? buff : "";
    this.readonly = true;
    this.pastbuff += this.ibuff.join("").concat(this.linebreak);
    let i = 0;
    const timer = setInterval(() => {
      if (i > buff.length - 1) {
        this.freeze();
        this.nbspline();
        clearInterval(timer);
        this.readonly = false;
      } else {
        this.pastbuff += buff[i];
      }
      this.render();
      window.scrollTo(0, document.body.scrollHeight);
      i++;
    }, this.cursorSpeed);
  };

  preFormatChar = (char) => {
    const charMap = {
      "<": "&lt;",
      ">": "&gt;",
      " ": "&nbsp;",
    };
    return charMap[char] || char;
  };

  initBanner = () => {
    this.print(`<pre>
    Basic retro look terminal emulator written in js.

    type 'help' for commands
    </pre>`);
  };

  init = () => {
    this.initBanner();
    window.addEventListener("keydown", (event) => {
      if (!this.readonly) {
        const code = event.code || event.which;
        if (Object.keys(this.keybindings).includes(code)) {
          this.keybindings[code](this.ibuff.join(""));
        } else {
          this.ibuff.push(this.preFormatChar(event.key));
        }
        this.render();
      }
    });
    this.render();
    window.scrollTo(0, document.body.scrollHeight);
  };
}

const t = new Terminal(config);
t.init();
