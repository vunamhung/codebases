import { getField } from "highline/utils/contentful/contentful_helper"

// Set the Styling based on mobile view or Desktop view
export const getBlockStyling = (isPhone, formattingObject) => {
  return {
    "display": getDisplayType(isPhone, formattingObject.desktopItemsPerRow, formattingObject.mobileItemsPerRow),
    "gridGap": getGridGap(isPhone, formattingObject.spaceBetweenDesktop, formattingObject.spaceBetweenMobile), //set the space between padding
    //Used to set the column widths in fr(fractions). eg. "1fr 2fr" means 2 columns with 33% and 66% width
    "gridTemplateColumns": getMasterGrid(isPhone, formattingObject.data, formattingObject.desktopItemsPerRow, formattingObject.mobileItemsPerRow),
    "justifyContent": "space-between",
    "width": "100%",
  }
}

export const getPadding = (isPhone, formattingObject) => {
  if (isPhone){
    return `${getPaddingItemName(formattingObject.mobilePaddingTop)} ${getPaddingItemName(formattingObject.mobilePaddingRight)} ${getPaddingItemName(formattingObject.mobilePaddingBottom)} ${getPaddingItemName(formattingObject.mobilePaddingLeft)}`
  } else {
    return `${getPaddingItemName(formattingObject.desktopPaddingTop)} ${getPaddingItemName(formattingObject.desktopPaddingRight)} ${getPaddingItemName(formattingObject.desktopPaddingBottom)} ${getPaddingItemName(formattingObject.desktopPaddingLeft)}`
  }
}

export const getContentBlockStyle = (formattingObject) => {
  return getCommonFormatting(formattingObject).blockStyle
}

const getPaddingItemName = (paddingString) => {
  return paddingMap[paddingString] || "0px"
}

const getDisplayType = (isPhone, desktopItemsPerRow, mobileItemsPerRow) => {
  if ( (!isPhone && desktopItemsPerRow === 1)|| (isPhone && mobileItemsPerRow === 1)) {
    return "block"
  } else {
    return "grid"
  }
}

const getGridGap = (isPhone, spaceBetweenDesktop, spaceBetweenMobile) => {
  if (isPhone){
    return getPaddingItemName(spaceBetweenMobile)
  } else {
    return getPaddingItemName(spaceBetweenDesktop)
  }
}

const getMasterGrid = (isPhone, blockData, desktopItemsPerRow, mobileItemsPerRow) => {
  if (isPhone){
    return getGridTemplateColumns(isPhone, blockData, mobileItemsPerRow)
  } else {
    return getGridTemplateColumns(isPhone, blockData, desktopItemsPerRow)
  }
}

const getGridTemplateColumns = (isPhone, blockData, NumOfColumns) => {
  //[.33,.66] means column 1 is 33% of the width and column 2 is 66%
  let columnWidthArray = getItemWidthsInArray(blockData, NumOfColumns)

  //Get the total width of each set width item in the first row.
  const totalWidthCount = getTotalWidthCount(isPhone, NumOfColumns, columnWidthArray)

  //Get the number of items in a row that do not have a set width
  const emptyItemCount = getEmptyItemCount(columnWidthArray)

  //Set the width for each of those items without a set width
  const emptyItemWidth = getEmptyItemWidth(totalWidthCount, emptyItemCount)

  //Make the item span the entire row on a phone if number of items per column === 1
  columnWidthArray = isPhone ? getMobileColumnWidthArray(columnWidthArray) : columnWidthArray

  //Generate the string that will tell css grid the number of columns and each column width
  return getTemplateField(columnWidthArray, emptyItemWidth)
}

//[.33,.66] means column 1 is 33% of the width and column 2 is 66%
const getItemWidthsInArray = (blockData, NumOfColumns) => {
  const itemWidthArray = new Array()

  for (let x = 0; x < NumOfColumns; x++ ){
    if (blockData.content[x]){
      if (blockData.content[x].sys.contentType && blockData.content[x].sys.contentType.sys.id == "contentBlock"){
        itemWidthArray[x] = eval(blockData.content[x].fields.width) || "0"
      } else {
        itemWidthArray[x] = "0"
      }
    } else {
      itemWidthArray[x] = "0"
    }
  }

  return itemWidthArray
}

//Get the total width of each set width item in the first row.
const getTotalWidthCount = (isPhone, numOfColumns, columnWidthArray) => {
  if (isPhone && numOfColumns === 1) return 1
  return columnWidthArray.reduce((total, currentWidth) => total + currentWidth, 0)
}

//Get the number of items in a row that do not have a set width
const getEmptyItemCount = (columnWidthArray) => {
  return columnWidthArray.reduce((total, currentWidth) => {
    return currentWidth === "0" ? total + 1 : total
  }, 0)
}

//Set the width for each of those items without a set width
const getEmptyItemWidth = (totalWidthCount, emptyItemCount) => {
  const WidthRemaining = (1-totalWidthCount).toFixed(4)
  //Divide the remaining width by the number of empty items to 2 decimal places
  return totalWidthCount >= 1 ? 1 : ((WidthRemaining)/(emptyItemCount)).toFixed(4)
}

//Make the item span the entire row on a phone if number of items per column === 1
const getMobileColumnWidthArray = (columnWidthArray) => { //make items span full width in mobile view
  return columnWidthArray.map((column) => {
    //multiplying by number of rows makes the fraction 1 or greater while keeping ratio, needed for css grid
    column = column < 1 && column > 0 ? column * columnWidthArray.length  : 1
    return column
  })
}

//Generate the string that will tell css grid the number of columns and each column width
const getTemplateField = (columnWidthArray, emptyItemWidth) => {
  return columnWidthArray.reduce((columnString, currentWidth) => {
    return `${columnString}${(currentWidth === "0" ? emptyItemWidth : currentWidth).toString()}fr `
  }, "")

}

export const getContentArray = (isPhone, mobileContentOrder, entry) => {
  const content = getField(entry, "content")
  if (isPhone && mobileContentOrder === "Reverse"){
    return content ? content.slice().reverse() : null
  }
  return content
}

export const getCommonFormatting = (contentfulEntry) => {
  const data = contentfulEntry.toJS().fields
  return {
    backgroundColor: data.formatting ? data.formatting.fields.backgroundColor : null,
    blockStyle: data.formatting ? data.formatting.fields.blockStyle : null,
    data,
    desktopContentAlign: data.formatting ? data.formatting.fields.desktopContentAlign : "Center",
    desktopItemsPerRow: data.desktopNumberOfItemsPerRows || 1,
    desktopPaddingBottom: data.formatting ? data.formatting.fields.desktopPaddingBottom : "0px",
    desktopPaddingLeft: data.formatting ? data.formatting.fields.desktopPaddingLeft : "0px",
    desktopPaddingRight: data.formatting ? data.formatting.fields.desktopPaddingRight : "0px",
    desktopPaddingTop: data.formatting ? data.formatting.fields.desktopPaddingTop : "0px",
    desktopWidth: data.formatting ? data.formatting.fields.desktopWidth : "100%",
    maxWidth: data.formatting ? data.formatting.fields.maxWidth : "100%",
    mobileContentAlign: data.formatting ? data.formatting.fields.mobileContentAlign : "Center",
    mobileContentOrder: data.nestedContentOrder || "Normal", //"Reverse" means that the nested items will appear in reverse order
    mobileItemsPerRow: data.mobileNumberOfItemsPerRow || 1,
    mobilePaddingBottom: data.formatting ? data.formatting.fields.mobilePaddingBottom : "0px",
    mobilePaddingLeft: data.formatting ? data.formatting.fields.mobilePaddingLeft : "0px",
    mobilePaddingRight: data.formatting ? data.formatting.fields.mobilePaddingRight : "0px",
    mobilePaddingTop: data.formatting ? data.formatting.fields.mobilePaddingTop : "0px",
    spaceBetweenDesktop: data.spaceBetweenDesktop || "0px",
    spaceBetweenMobile: data.spaceBetweenMobile || "0px",
  }
}

export const getStylingObject = (isPhone, contentfulEntry) => {
  const format = getCommonFormatting(contentfulEntry)

  if (isPhone){
    return {
      "backgroundColor": format.backgroundColor,
      "float": horizontalContentAlignMap[format.mobileContentAlign] || "unset",
      "maxWidth": format.maxWidth,
      "padding": getPadding(isPhone, format),
    }
  } else {
    return {
      "backgroundColor": format.backgroundColor,
      "float": horizontalContentAlignMap[format.desktopContentAlign] || "unset",
      "maxWidth": format.maxWidth,
      "padding": getPadding(isPhone, format),
      "width": format.desktopWidth || "100%",
    }
  }
}

export const getParentStylingObject = (contentfulEntry) => {
  const format = getCommonFormatting(contentfulEntry)
  return {
    "alignItems": getVerticalAlign(format.desktopContentAlign),
    "display": "flex",
    "justifyContent": getHorizontalAlign(format.desktopContentAlign),
    "width": "100%",
  }
}

const getVerticalAlign = (position) => {
  return verticalContentAlignMap[position] || "center"
}

const getHorizontalAlign = (position) => {
  return horizontalContentAlignMap[position] || "center"
}

const verticalContentAlignMap = {
  "Bottom": "flex-end",
  "Bottom Left": "flex-end",
  "Bottom Right": "flex-end",
  "Center": "center",
  "Center Left": "center",
  "Center Right": "center",
  "Top": "flex-start",
  "Top Left": "flex-start",
  "Top Right": "flex-start",
}

const horizontalContentAlignMap = {
  "Bottom": "center",
  "Bottom Left": "flex-start",
  "Bottom Right": "flex-end",
  "Center": "center",
  "Center Left": "flex-start",
  "Center Right": "flex-end",
  "Top": "center",
  "Top Left": "flex-start",
  "Top Right": "flex-end",
}

const paddingMap = {
  "Extra Small (px)": "4px",
  "Extra Small (%)": "2%",
  "Small (px)": "8px",
  "Small (%)": "4%",
  "Medium (px)": "16px",
  "Medium (%)": "8%",
  "Large (px)": "32px",
  "Large (%)": "16%",
  "Extra Large (px)": "64px",
  "Extra Large (%)": "25%",
  "Huge (px)": "128px",
  "Huge (%)": "30%",
}
