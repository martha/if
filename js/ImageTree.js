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

            let shouldShowImage = thisImage === this.currentImage;
            let shouldBeClickable = thisImage.parent === this.currentImage;

            thisImage.update(shouldShowImage, shouldBeClickable);

            if (shouldBeClickable && thisImage.clickable) {
                this.imageMap[thisImage.clickable.uuid] = thisImage;
                this.clickables.push(thisImage.clickable);
            }
        }
        return allImages;
    }

    this.traverseTree();
}

// todo: try an orthographic camera

// todo: make transition smoother - add more details on how to do this
// - keep base image in background
// - fade new image in while zooming, instead of abrupt transition

// todo: make siblings clickable = navigable with little arrows. ... change sibling structure
// todo: add ability to zoom back up to the parent level

// TODO: create a readme, crediting the organizing code

// todo: there is sometimes still a weird bug where the perspective camera gets off kilter, why does that happen?

// TODO: set maxDistance and minDistance it so that the close position never gets too close

// todo: try three js keeping its object references

// controls:
// TODO: why is key control not enabled?
// TODO: use two finger scroll for horizontal mvt
// TODO: scroll in to pointer

// todo: enable hover on label as well as image area
