export function ImageTree(root) {
    this.root = root;
    this.currentImage = root;
    this.imageMap = {};
    this.clickables = [];

    this.selectImage = function(clickableUuid) {
        const image = this.imageMap[clickableUuid];
        this.currentImage.showImage = false;
        this.currentImage = image;
        this.currentImage.showImage = true;

        this.traverseTree(this.root);
    }

    this.hoverImage = function(clickableUuid) {
        const image = this.imageMap[clickableUuid];
        image.hover();
    }

    this.unhoverImage = function(clickableUuid) {
        const image = this.imageMap[clickableUuid];
        image.unhover();
    }

    this.setImageOpacity = function(clickableUuid, opacity) {
        const image = this.imageMap[clickableUuid];
        if (image.sprite) {
            image.sprite.material.transparent = true;
            image.sprite.material.opacity = opacity;
        }
    }

    this.traverseTree = function() {
        const allImages = [];
        const bfsStack = [this.root];

        // reset both to empty
        this.imageMap = {};
        this.clickables = [];
        while (bfsStack.length > 0) {
            const thisImage = bfsStack.shift();
            allImages.push(thisImage);
            Array.prototype.push.apply(bfsStack, thisImage.children);

            let shouldShowImage = thisImage === this.currentImage || thisImage == this.currentImage.parent;
            let shouldBeClickable = thisImage.parent === this.currentImage;

            thisImage.update(shouldShowImage, shouldBeClickable);

            if (thisImage.clickable) {  // todo - clean up
                this.imageMap[thisImage.clickable.uuid] = thisImage;
                if (shouldBeClickable) {
                    this.clickables.push(thisImage.clickable);
                }
            }
        }
        return allImages;
    }

    this.traverseTree();
}

// todo: add ability to zoom back up to the parent level
// todo: make siblings clickable = navigable with little arrows. ... change sibling structure
// TODO: create a readme, crediting the organizing code

// todo: consider only enabling scrolling when on leaf node?
// todo: try an orthographic camera
// todo: there is sometimes still a weird bug where the perspective camera gets off kilter, why does that happen?
// TODO: set maxDistance and minDistance it so that the close position never gets too close

// controls:
// TODO: why is key control not enabled?
// TODO: use two finger scroll for horizontal mvt
// TODO: scroll in to pointer

// todo: enable hover on label as well as image area
