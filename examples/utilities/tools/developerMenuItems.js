//
//  developerMenuItems.js
//  examples
//
//  Created by Brad Hefta-Gaub on 2/24/14
//  Copyright 2013 High Fidelity, Inc.
//
//  Adds a bunch of developer and debugging menu items
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var createdRenderMenu = false;

var ENTITIES_MENU = "Developer > Entities";
var COLLISION_UPDATES_TO_SERVER = "Don't send collision updates to server";

var RENDER_MENU = "Developer > Render";
var ENTITIES_ITEM = "Entities";
var AVATARS_ITEM = "Avatars";

function setupMenus() {
    if (!Menu.menuExists("Developer")) {
        Menu.addMenu("Developer");
    }
    if (!Menu.menuExists(ENTITIES_MENU)) {
        Menu.addMenu(ENTITIES_MENU);
        
        // NOTE: these menu items aren't currently working. I've temporarily removed them. Will add them back once we
        // rewire these to work
        /*
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Display Model Bounds", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Display Model Triangles", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Display Model Element Bounds", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Display Model Element Children", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Don't Do Precision Picking", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Don't Attempt Render Entities as Scene", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Don't Do Precision Picking", isCheckable: true, isChecked: false });
        Menu.addMenuItem({ menuName: "Developer > Entities", menuItemName: "Disable Light Entities", isCheckable: true, isChecked: false });
        */
        Menu.addMenuItem({ menuName: ENTITIES_MENU, menuItemName: COLLISION_UPDATES_TO_SERVER, isCheckable: true, isChecked: false });
    }
    
    if (!Menu.menuExists(RENDER_MENU)) {
        Menu.addMenu(RENDER_MENU);
        createdRenderMenu = true;
    }
    
    if (!Menu.menuItemExists(RENDER_MENU, ENTITIES_ITEM)) {
        Menu.addMenuItem({ menuName: RENDER_MENU, menuItemName: ENTITIES_ITEM, isCheckable: true, isChecked: Scene.shouldRenderEntities })
    }
    
    if (!Menu.menuItemExists(RENDER_MENU, AVATARS_ITEM)) {
        Menu.addMenuItem({ menuName: RENDER_MENU, menuItemName: AVATARS_ITEM, isCheckable: true, isChecked: Scene.shouldRenderAvatars })
    }
}

Menu.menuItemEvent.connect(function (menuItem) {
    print("menuItemEvent() in JS... menuItem=" + menuItem);

    if (menuItem == COLLISION_UPDATES_TO_SERVER) {
        var dontSendUpdates = Menu.isOptionChecked(COLLISION_UPDATES_TO_SERVER); 
        print("  dontSendUpdates... checked=" + dontSendUpdates);
        Entities.setSendPhysicsUpdates(!dontSendUpdates);
    } else if (menuItem == ENTITIES_ITEM) {
        Scene.shouldRenderEntities = Menu.isOptionChecked(ENTITIES_ITEM);
    } else if (menuItem == AVATARS_ITEM) {
        Scene.shouldRenderAvatars = Menu.isOptionChecked(AVATARS_ITEM);
    }
});

setupMenus();

// register our scriptEnding callback
Script.scriptEnding.connect(scriptEnding);

function scriptEnding() {
    Menu.removeMenu(ENTITIES_MENU);
    
    if (createdRenderMenu) {
        Menu.removeMenu(RENDER_MENU);
    } else {
        Menu.removeMenuItem(RENDER_MENU, ENTITIES_ITEM);
        Menu.removeMenuItem(RENDER_MENU, AVATARS_ITEM);
    }
}

setupMenus();
Script.scriptEnding.connect(scriptEnding);
