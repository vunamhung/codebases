import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import NavGroup from "highline/components/nav_group"
import NavItem from "highline/components/nav_item"
import styles from "highline/styles/components/tab_group.module.css"

class TabGroup extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    defaultTab: PropTypes.string,
    layout: PropTypes.oneOf(["sliding", "tabbed", "swatch"]),
    onTabChange: PropTypes.func,
    trackTabClick: PropTypes.func,
  }

  static defaultProps = {
    layout: "sliding",
    onTabChange: () => {},
    trackTabClick: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      activeTab: props.defaultTab || React.Children.toArray(props.children)[0].props.title,
      uniqueIdKey: "",
    }
  }

  componentDidMount() {
    this.setState({ uniqueIdKey: `tabbed-nav-key-${Math.random()}` })
  }

  handleTabChange = (name) => {
    this.setState({ activeTab: name })
    this.props.onTabChange(name)
    this.props.trackTabClick(name)
  }

  render() {
    const {
      children,
      className,
      layout,
    } = this.props

    const {
      activeTab,
      uniqueIdKey,
    } = this.state

    const tabs = React.Children.toArray(children)

    const currentTab = tabs.find(
      (tab) => tab.props.title === activeTab,
    )

    return (
      <div
        className={ classNames(
          "component",
          "tabbed-nav-component",
          styles.component,
          className,
        ) }
      >
        { tabs && tabs.length > 1 &&
          <NavGroup layout={ layout } activeItemName={ activeTab } onChange={ this.handleTabChange }>
            { tabs.map((tab, index) => (
              <NavItem key={ tab.props.title } name={ tab.props.title }>
                <button
                  role="tab"
                  aria-selected={ activeTab === tab.props.title }
                  aria-controls={ `${uniqueIdKey}-section-${index}` }
                  id={ `${uniqueIdKey}-tab-${index}` }
                >
                  { tab.props.titleContent ? tab.props.titleContent : tab.props.title }
                </button>
              </NavItem>
            )) }
          </NavGroup>
        }
        { tabs &&
          <div
            id={ `${uniqueIdKey}-section-${activeTab}` }
            aria-labelledby={ `${uniqueIdKey}-tab-${activeTab}` }
          >
            { currentTab }
          </div>
        }
      </div>
    )
  }
}

export default TabGroup
