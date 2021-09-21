/* eslint-disable react/display-name */
/* This file includes all icons used in Highline and bakes accessibility
 * into the Font Awesome icons through the "title" attribute
 */
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faArrowToTop } from "@fortawesome/pro-light-svg-icons/faArrowToTop"
import { faArrowRight } from "@fortawesome/pro-light-svg-icons/faArrowRight"
import { faBan } from "@fortawesome/pro-light-svg-icons/faBan"
import { faBars } from "@fortawesome/pro-light-svg-icons/faBars"
import { faBriefcase } from "@fortawesome/pro-light-svg-icons/faBriefcase"
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck"
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons/faChevronLeft"
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight"
import { faChevronCircleDown } from "@fortawesome/pro-light-svg-icons/faChevronCircleDown"
import { faCommentAltLines } from "@fortawesome/pro-light-svg-icons/faCommentAltLines"
import { faCreditCard } from "@fortawesome/pro-light-svg-icons/faCreditCard"
import { faEllipsisHAlt } from "@fortawesome/pro-light-svg-icons/faEllipsisHAlt"
import { faEnvelope } from "@fortawesome/pro-light-svg-icons/faEnvelope"
import { faFileInvoice } from "@fortawesome/pro-light-svg-icons/faFileInvoice"
import { faGift } from "@fortawesome/pro-light-svg-icons/faGift"
import { faGlobeAmericas } from "@fortawesome/pro-light-svg-icons/faGlobeAmericas"
import { faGolfBall } from "@fortawesome/pro-light-svg-icons/faGolfBall"
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle"
import { faHeart as emptyHeartIcon } from "@fortawesome/pro-light-svg-icons/faHeart"
import { faLongArrowLeft } from "@fortawesome/pro-light-svg-icons/faLongArrowLeft"
import { faLongArrowRight } from "@fortawesome/pro-light-svg-icons/faLongArrowRight"
import { faMapMarkerAlt } from "@fortawesome/pro-light-svg-icons/faMapMarkerAlt"
import { faMinus } from "@fortawesome/pro-light-svg-icons/faMinus"
import { faMinusCircle } from "@fortawesome/pro-light-svg-icons/faMinusCircle"
import { faMoneyCheckEdit } from "@fortawesome/pro-light-svg-icons/faMoneyCheckEdit"
import { faPauseCircle } from "@fortawesome/pro-light-svg-icons/faPauseCircle"
import { faPencil } from "@fortawesome/pro-light-svg-icons/faPencil"
import { faPencilRuler } from "@fortawesome/pro-light-svg-icons/faPencilRuler"
import { faPlayCircle } from "@fortawesome/pro-light-svg-icons/faPlayCircle"
import { faPlus } from "@fortawesome/pro-light-svg-icons/faPlus"
import { faPlusCircle } from "@fortawesome/pro-light-svg-icons/faPlusCircle"
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons/faQuestionCircle"
import { faSearch } from "@fortawesome/pro-light-svg-icons/faSearch"
import { faSearchMinus } from "@fortawesome/pro-light-svg-icons/faSearchMinus"
import { faSearchPlus } from "@fortawesome/pro-light-svg-icons/faSearchPlus"
import { faShoppingBag } from "@fortawesome/pro-light-svg-icons/faShoppingBag"
import { faSlidersV } from "@fortawesome/pro-light-svg-icons/faSlidersV"
import { faSquare } from "@fortawesome/pro-light-svg-icons/faSquare"
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes"
import { faToiletPaperAlt } from "@fortawesome/pro-light-svg-icons/faToiletPaperAlt"
import { faTrash } from "@fortawesome/pro-light-svg-icons/faTrash"
import { faTshirt } from "@fortawesome/pro-light-svg-icons/faTshirt"
import { faUnlock } from "@fortawesome/pro-light-svg-icons/faUnlock"
import { faUserCircle } from "@fortawesome/pro-light-svg-icons/faUserCircle"
import { faVolume } from "@fortawesome/pro-light-svg-icons/faVolume"
import { faWasher } from "@fortawesome/pro-light-svg-icons/faWasher"

import { faBan as faBanHeavy } from "@fortawesome/free-solid-svg-icons/faBan"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle"
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare"
import { faHeart as filledHeartIcon } from "@fortawesome/free-solid-svg-icons/faHeart"
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock"

import { faApplePay } from "@fortawesome/free-brands-svg-icons/faApplePay"
import { faFacebookF } from "@fortawesome/free-brands-svg-icons/faFacebookF"
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram"
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter"
import { faYoutube } from "@fortawesome/free-brands-svg-icons/faYoutube"


// Custom icons or icons not available from Font Awesome
import AffirmCircleIcon from "highline/svg/icons/affirm-circle.svg"
import AffirmIcon from "highline/svg/icons/affirm.svg"
import AmexIcon from "highline/svg/icons/amex.svg"
import ApplePayCardIcon from "highline/svg/icons/apple-pay.svg"
import CreditCardIcon from "highline/svg/icons/credit-card.svg"
import CreditCardBWIcon from "highline/svg/icons/credit-card-bw.svg"
import DinersClubIcon from "highline/svg/icons/diners-club.svg"
import DiscoverIcon from "highline/svg/icons/discover.svg"
import GoogleWalletIcon from "highline/svg/icons/google-wallet.svg"
import JCBIcon from "highline/svg/icons/jcb.svg"
import MaestroIcon from "highline/svg/icons/maestro.svg"
import MasterCardIcon from "highline/svg/icons/master-card.svg"
import PaypalIcon from "highline/svg/icons/paypal.svg"
import PaypalBWIcon from "highline/svg/icons/paypal-bw.svg"
import PaypalWhiteTextIcon from "highline/svg/icons/paypal_white_text.svg"
import StripeIcon from "highline/svg/icons/stripe.svg"
import VisaIcon from "highline/svg/icons/visa.svg"
import VisaCheckoutIcon from "highline/svg/icons/visa-checkout.svg"
import VisaCheckoutColorIcon from "highline/svg/icons/visa-checkout-color.svg"
import VisaCheckoutBWIcon from "highline/svg/icons/visa-checkout-bw.svg"

/* Abstracted icon function to allow for easy alteration across all icons if required
 * THE ORDER OF THE PROPS MATTERS
 * Ensure properties that should not be overridden are AFTER the spread props
 */
const faIcon = ({ icon, props, title }) => (
  <FontAwesomeIcon
    title={ title }
    { ...props }
    icon={ icon } />
)
/*
 * If you don't find the icon you want, you can look up additional icons and add a wrapper function here.
 * <https://fontawesome.com/icons?d=gallery&s=light>
 * Be sure to add a test in icons.test.js for any new icons
 */
export const AccountIcon = (props) => faIcon({ icon: faUserCircle, props, title: "Account icon: person silhouette within a circle" })
export const ApplePayIcon = (props) => faIcon({ icon: faApplePay, props, title: "ApplePay icon: Apple logo with word Pay" })
export const ArrowRightIcon = (props) => faIcon({ icon: faArrowRight, props, title: "Arrow Right icon : short arrow pointed right" })
export const BackArrowIcon = (props) => faIcon({ icon: faLongArrowLeft, props, title: "Back icon: long arrow pointed left" })
export const BackToTopArrowIcon = (props) => faIcon({ icon: faArrowToTop, props, title: "Back to top icon: Arrow pointing up under horizontal line" })
export const BriefcaseIcon = (props) => faIcon({ icon: faBriefcase, props, title: "Briefcase icon: line sketch of a briefcase" })
export const CancelIcon = (props) => faIcon({ icon: faBan, props, title: "Cancel icon: circle with diagonal slash" })
export const CancelIconHeavy = (props) => faIcon({ icon: faBanHeavy, props, title: "Cancel icon: circle with diagonal slash" })
export const CartIcon = (props) => faIcon({ icon: faShoppingBag, props, title: "Cart icon: silhouette of a shopping bag" })
export const CheckIcon = (props) => faIcon({ icon: faCheck, props, title: "Checkmark icon" })
export const CheckCircleIcon = (props) => faIcon({ icon: faCheckCircle, props, title: "Checkmark icon: filled circle with checkmark" })
export const CheckedIcon = (props) => faIcon({ icon: faCheckSquare, props, title: "Checkbox icon: square with a check inside it" })
export const CirclePlusIcon = (props) => faIcon({ icon: faPlusCircle, props, title: "Circle with plus icon" })
export const CircleMinusIcon = (props) => faIcon({ icon: faMinusCircle, props, title: "Circle with minus icon" })
export const CloseIcon = (props) => faIcon({ icon: faTimes, props, title: "Close icon: a simple X" })
export const EditIcon = (props) => faIcon({ icon: faPencil, props, title: "Edit icon: shape of a pencil" })
export const EllipsisIcon = (props) => faIcon({ icon: faEllipsisHAlt, props, title: "Ellipsis icon: three horizontal dots" })
export const EmptyHeartIcon = (props) => faIcon({ icon: emptyHeartIcon, props, title: "Empty Heart icon" })
export const EnvelopeIcon = (props) => faIcon({ icon: faEnvelope, props, title: "Envelope icon" })
export const FabricIcon = (props) => faIcon({ icon: faToiletPaperAlt, props: { ...props, style: { transform: "rotate(-90deg)" } } })
export const FileInvoiceIcon = (props) => faIcon({ icon: faFileInvoice, props, title: "File Invoice Icon" })
export const FilledHeartIcon = (props) => faIcon({ icon: filledHeartIcon, props, title: "Filled Heart icon" })
export const FilterIcon = (props) => faIcon({ icon: faSlidersV, props, title: "Filter icon: three vertical bars with sliders" })
export const GiftIcon = (props) => faIcon({ icon: faGift, props, title: "Gift icon: a present with a bow" })
export const GlobeIcon = (props) => faIcon({ icon: faGlobeAmericas, props })
export const GolfBallIcon = (props) => faIcon({ icon: faGolfBall, props })
export const InfoCircleIcon = (props) => faIcon({ icon: faInfoCircle, props, title: "Cicle with info icon" })
export const HamburgerIcon = (props) => faIcon({ icon: faBars, props, title: "Hamburger icon: three horizontal bars" })
export const HelpIcon = (props) => faIcon({ icon: faQuestionCircle, props, title: "Help icon: a question mark within a circle" })
export const LongArrowRightIcon = (props) => faIcon({ icon: faLongArrowRight, props, title: "Forward icon: long arrow pointed right" })
export const LockedIcon = (props) => faIcon({ icon: faLock, props, title: "Lock icon: currently locked" })
export const MinusIcon = (props) => faIcon({ icon: faMinus, props })
export const MoneyCheckEdit = (props) => faIcon({ icon: faMoneyCheckEdit, props, title: "Money Check Edit Icon" })
export const NavigationIcon = (props) => faIcon({ icon: faMapMarkerAlt, props, title: "Navigation icon: shape of a map marker" })
export const PauseIcon = (props) => faIcon({ icon: faPauseCircle, props })
export const PencilRulerIcon = (props) => faIcon({ icon: faPencilRuler, props })
export const PlayIcon = (props) => faIcon({ icon: faPlayCircle, props })
export const PlusIcon = (props) => faIcon({ icon: faPlus, props })
export const SearchIcon = (props) => faIcon({ icon: faSearch, props, title: "Search icon: magnifying glass" })
export const ShirtIcon = (props) => faIcon({ icon: faTshirt, props, title: "Shirt icon" })
export const TextBubbleIcon = (props) => faIcon({ icon: faCommentAltLines, props, title: "Text icon: speech bubble with lines" })
export const TrashIcon = (props) => faIcon({ icon: faTrash, props, title: "Trash icon" })
export const UncheckedIcon = (props) => faIcon({ icon: faSquare, props, title: "Square icon: an empty square" })
export const UnlockedIcon = (props) => faIcon({ icon: faUnlock, props, title: "Lock icon: currently unlocked" })
export const VolumeIcon = (props) => faIcon({ icon: faVolume, props, title: "Volume icon: sound on" })
export const WasherIcon = (props) => faIcon({ icon: faWasher, props })

export const PaymentIcons = {
  Affirm: (props) => <AffirmIcon { ...props } />,
  AffirmCircle: (props) => <AffirmCircleIcon { ...props } />,
  Amex: (props) => <AmexIcon { ...props } />,
  ApplePay: (props) => <ApplePayCardIcon { ...props } />,
  CreditCard: (props) => faIcon({ icon: faCreditCard, props, title: "Credit Card icon: generic blank credit card" }),
  CreditCardBW: (props) => <CreditCardBWIcon { ...props } />,
  CreditCardColor: (props) => <CreditCardIcon { ...props } />,
  DinersClub: (props) => <DinersClubIcon { ...props } />,
  Discover: (props) => <DiscoverIcon { ...props } />,
  GoogleWallet: (props) => <GoogleWalletIcon { ...props } />,
  JCB: (props) => <JCBIcon { ...props } />,
  Maestro: (props) => <MaestroIcon { ...props } />,
  MasterCard: (props) => <MasterCardIcon { ...props } />,
  Paypal: (props) => <PaypalIcon { ...props } />,
  PaypalBW: (props) => <PaypalBWIcon { ...props } />,
  PaypalWhiteTextIcon: (props) => <PaypalWhiteTextIcon { ...props } />,
  Stripe: (props) => <StripeIcon { ...props } />,
  Visa: (props) => <VisaIcon { ...props } />,
  VisaCheckout: (props) => <VisaCheckoutIcon { ...props } />,
  VisaCheckoutColor: (props) => <VisaCheckoutColorIcon { ...props } />,
  VisaCheckoutBW: (props) => <VisaCheckoutBWIcon { ...props } />,
}

export const SocialIcons = {
  Facebook: (props) => faIcon({ icon: faFacebookF, props, title: "Facebook icon" }),
  Instagram: (props) => faIcon({ icon: faInstagram, props, title: "Instagram icon" }),
  Twitter: (props) => faIcon({ icon: faTwitter, props, title: "Twitter icon" }),
  Youtube: (props) => faIcon({ icon: faYoutube, props, title: "Youtube icon" }),
}

export const ZoomIcons = {
  ZoomIn: (props) => faIcon({ icon: faSearchPlus, props, title: "Zoom in icon: magnifying glass with plus" }),
  ZoomOut: (props) => faIcon({ icon: faSearchMinus, props, title: "Zoom out icon: magnifying glass with minus" }),
}

export const ChevronIcons = {
  CircleDown: (props) => faIcon({ icon: faChevronCircleDown, props }),
  Left: (props) => faIcon({ icon: faChevronLeft, props }),
  Right: (props) => faIcon({ icon: faChevronRight, props }),
}
