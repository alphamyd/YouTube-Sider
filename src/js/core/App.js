const electronAPI = electron.remote.getCurrentWindow();

const DOMClasses = {
  errorActive: "main__error--active",
  playerActive: "player--initialized"
};

export default class App {
  constructor({
      opacity = 100,
      isAlwaysOnTopEnabled = false,
      isVideoRepeatEnabled = false,
      playerElementDOM = document.getElementById("player"),
      errorElementDOM = document.getElementById("main-error")
    } = {}) {
    this._remote = electronAPI; // Electron Remote API
    this._state = { opacity, isAlwaysOnTopEnabled, isVideoRepeatEnabled }; // App state
    this._playerElementDOM = playerElementDOM; // DOM element for player
    this._errorElementDOM = errorElementDOM; // DOM element for errors container
  }

  /**
   * GETTER: return state option "always on top"
   * @return {boolean}
   */
  get alwaysOnTop() {
    return this._state.isAlwaysOnTopEnabled;
  }

  /**
   * SETTER: set always on top mode
   * @param flag {boolean} - if true - enabled, otherwise - disabled
   */
  set alwaysOnTop(flag) {
    this._remote.setAlwaysOnTop(flag);
    this._state.isAlwaysOnTopEnabled = flag;
  }

  /**
   * GETTER: return state option "video repeat"
   * @return {boolean}
   */
  get videoRepeat() {
    return this._state.isVideoRepeatEnabled;
  }

  /**
   * SETTER: set video repeat mode
   * @param flag {boolean} - if true - enabled, otherwise - disabled
   */
  set videoRepeat(flag) {
    this._state.isVideoRepeatEnabled = flag;
    this._playerElementDOM.send("player:command:repeat", flag);
  }

  /**
   * GETTER: return state option "opacity"
   * @return {number} - percentage of opacity
   */
  get opacity() {
    return this._state.opacity;
  }

  /**
   * SETTER: set always on top mode
   * @param level {number} - percentage of opacity
   */
  set opacity(level) {
    this._state.opacity = level;
    this._remote.setOpacity(level);
  }

  /**
   * Create player by YouTube ID
   * @param YouTubeID
   * @return {App} - this
   */
  openPlayer(YouTubeID) {
    const remote = this._remote;
    const player = this._playerElementDOM;

    player.src = `https://www.youtube.com/embed/${YouTubeID}?enablejsapi=1&version=3&playerapiid=ytplayer&rel=0&autoplay=1&showinfo=0&fs=0&ecver=2&iv_load_policy=3&cc_load_policy=0&vq=hd1080&suggestedQuality=hd1080&containment=body&playsinline=1&widgetid=1`;

    document.body.classList.add(DOMClasses.playerActive);

    this.clearErrors();

    player.addEventListener("dom-ready", () => player.send("player:command:repeat", this._state.isVideoRepeatEnabled));

    // Set window title
    fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + YouTubeID)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((response) => {
            if (response.title) {
              remote.setTitle(response.title);
            }
          })
        }
      });

    // Set window size by aspect ratio of thumb image
    let img = new Image();

    img.src = "https://img.youtube.com/vi/" + YouTubeID + "/maxresdefault.jpg";

    img.onload = function() {
      if (this.width <= 120) { // if image not found (120 - default size of youtube not found image)
        return;
      }

      let originalSize = remote.getSize();

      let aspectRatio = this.width / this.height;

      let width = originalSize[0].toFixed();
      let height = (width / aspectRatio).toFixed();

      remote.setSize(parseFloat(width), parseFloat(height));
    };

    return this;
  }

  /**
   * Destroy player
   * @return {App} - this
   */
  closePlayer() {
    this._playerElementDOM.src = "about:blank";
    this._remote.setTitle("YouTube Sider");
    document.body.classList.remove(DOMClasses.playerActive);
    return this;
  }

  /**
   * Generates errors
   * @param message - error message
   * @return {App} - this
   */
  generateError(message) {
    this._errorElementDOM.setAttribute("data-tooltip", message);
    this._errorElementDOM.classList.add(DOMClasses.errorActive);

    return this;
  }

  /**
   * Clear errors DOM container
   * @return {App} - this
   */
  clearErrors() {
    this._errorElementDOM.classList.remove(DOMClasses.errorActive);

    return this;
  }
}