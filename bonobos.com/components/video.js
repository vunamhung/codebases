import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/video.module.css"


class Video extends React.PureComponent {
  static propTypes = {
    autoPlay: PropTypes.bool,
    captions: PropTypes.string,
    controls: PropTypes.bool,
    descriptionText: PropTypes.string,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    onPause: PropTypes.func,
    onPlay: PropTypes.func,
    posterImage: PropTypes.string,
    preload: PropTypes.oneOf(["auto", "none", "metadata"]),
    setCrossOrigin: PropTypes.bool,
    transcriptLink: PropTypes.string,
    videoRef: PropTypes.func,
    videoURL: PropTypes.string.isRequired,
  }

  static defaultProps = {
    autoPlay: false,
    captions: null,
    controls: true,
    descriptionText: "",
    loop: false,
    muted: true,
    onPause: () => {},
    onPlay: () => {},
    posterImage: null,
    preload: "metadata",
    //set true for contentful videos, default false for other sources
    setCrossOrigin: false,
    transcriptLink: "",
  }

  state = {
    isMounted: false,
  }

  componentDidMount() {
    this.setState({ isMounted: true })
  }

  render() {
    const {
      autoPlay,
      captions,
      controls,
      descriptionText,
      loop,
      muted,
      onPause,
      onPlay,
      posterImage,
      preload,
      setCrossOrigin,
      transcriptLink,
      videoRef,
      videoURL,
    } = this.props

    return (
      <div className={ classNames(
        "component",
        "video-component",
        styles.component,
      ) }>
        { this.state.isMounted && descriptionText &&
          <div className={ styles.descriptionContainer } role="tabpanel" tabIndex="0">
            <div className={ styles.textDescription } >
              <div className={ styles.videoDescriptionTitle }>Video Description</div>
              { descriptionText }
              { transcriptLink &&
                <div>
                  <a className={ styles.transcriptLink } href={ transcriptLink } rel="noopener noreferrer" target="_blank" >View Transcript</a>
                </div>
              }
            </div>
          </div>
        }
        <video
          //Allows video and captions to come from different sources
          crossOrigin={ setCrossOrigin ? "anonymous" : undefined }
          autoPlay={ autoPlay }
          controls={ controls }
          muted={ muted }
          loop={ loop }
          ref={ videoRef }
          onPlay={ onPlay }
          onPause={ onPause }
          preload={ preload }
          poster={ posterImage }
        >
          <source src={ videoURL } />
          <track src={ captions } label="English"
            kind="captions" srcLang="en"></track>
        </video>
      </div>
    )
  }
}

export default Video
