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

    this.traverseTree = function() {
        const allImages = [];
        const bfsStack = [this.root];
        while (bfsStack.length > 0) {
            const thisImage = bfsStack.shift();
            allImages.push(thisImage);
            Array.prototype.push.apply(bfsStack, thisImage.children);

            let shouldShowImage = thisImage === this.currentImage;
            let shouldBeClickable = thisImage.parent === this.currentImage;

            thisImage.update(shouldShowImage, shouldBeClickable);

            if (thisImage.clickable) {
                this.imageMap[thisImage.clickable.uuid] = thisImage;
                this.clickables.push(thisImage.clickable);
            }
        }
        return allImages;
    }

    this.traverseTree();
}

// todo: registration issues
// todo: clear the three canvas
// todo: with my current code, siblings probably shouldn't be clickable, but they still are. why?
// todo: once that bug is tracked down, then make siblings clickable = navigable with little arrows
// todo: make ability to zoom back up to the parent level
// todo: the image tree should be in charge of telling the camera where to look?
// todo: make sure it works with multiple layers