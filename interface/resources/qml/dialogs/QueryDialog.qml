//
//  QueryDialog.qml
//
//  Created by Bradley Austin Davis on 22 Jan 2016
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

import QtQuick 2.5
import QtQuick.Controls 1.4
import QtQuick.Dialogs 1.2 as OriginalDialogs

import "../controls-uit"
import "../styles-uit"
import "../windows-uit"

ModalWindow {
    id: root
    HifiConstants { id: hifi }
    implicitWidth: 640
    implicitHeight: 320
    visible: true

    signal selected(var result);
    signal canceled();

    property int icon: hifi.icons.none
    property string iconText: ""
    property int iconSize: 35
    onIconChanged: updateIcon();

    property var items;
    property string label
    property var result;
    // FIXME not current honored
    property var current;

    // For text boxes
    property alias placeholderText: textResult.placeholderText
    property alias prefilledText: textResult.text

    // For combo boxes
    property bool editable: true;

    function updateIcon() {
        if (!root) {
            return;
        }
        iconText = hifi.glyphForIcon(root.icon);
    }

    Item {
        clip: true
        width: pane.width
        height: pane.height
        anchors.margins: 0

        QtObject {
            id: d
            readonly property int minWidth: 480
            readonly property int maxWdith: 1280
            readonly property int minHeight: 120
            readonly property int maxHeight: 720

            function resize() {
                var targetWidth = pane.width
                var targetHeight = (items ? comboBox.controlHeight : textResult.controlHeight) + 5 * hifi.dimensions.contentSpacing.y + buttons.height
                root.width = (targetWidth < d.minWidth) ? d.minWidth : ((targetWidth > d.maxWdith) ? d.maxWidth : targetWidth)
                root.height = (targetHeight < d.minHeight) ? d.minHeight: ((targetHeight > d.maxHeight) ? d.maxHeight : targetHeight)
            }
        }

        Item {
            anchors {
                top: parent.top
                bottom: buttons.top;
                left: parent.left;
                right: parent.right;
                margins: 0
                bottomMargin: 2 * hifi.dimensions.contentSpacing.y
            }

            // FIXME make a text field type that can be bound to a history for autocompletion
            TextField {
                id: textResult
                label: root.label
                focus: items ? false : true
                visible: items ? false : true
                anchors {
                    left: parent.left;
                    right: parent.right;
                    bottom: parent.bottom
                }
            }

            ComboBox {
                id: comboBox
                label: root.label
                focus: true
                visible: items ? true : false
                anchors {
                    left: parent.left
                    right: parent.right
                    bottom: parent.bottom
                }
                model: items ? items : []
            }
        }

        Flow {
            id: buttons
            focus: true
            spacing: hifi.dimensions.contentSpacing.x
            onHeightChanged: d.resize(); onWidthChanged: d.resize();
            layoutDirection: Qt.RightToLeft
            anchors {
                bottom: parent.bottom
                right: parent.right
                margins: 0
                bottomMargin: hifi.dimensions.contentSpacing.y
            }
            Button { action: cancelAction }
            Button { action: acceptAction }
        }

        Action {
            id: cancelAction
            text: qsTr("Cancel")
            shortcut: Qt.Key_Escape
            onTriggered: {
                root.canceled();
                root.destroy();
            }
        }
        Action {
            id: acceptAction
            text: qsTr("OK")
            shortcut: Qt.Key_Return
            onTriggered: {
                root.result = items ? comboBox.currentText : textResult.text
                root.selected(root.result);
                root.destroy();
            }
        }
    }

    Keys.onPressed: {
        if (!visible) {
            return
        }

        switch (event.key) {
        case Qt.Key_Escape:
        case Qt.Key_Back:
            cancelAction.trigger()
            event.accepted = true;
            break;

        case Qt.Key_Return:
        case Qt.Key_Enter:
            acceptAction.trigger()
            event.accepted = true;
            break;
        }
    }

    Component.onCompleted: {
        updateIcon();
        d.resize();
        textResult.forceActiveFocus();
    }
}
