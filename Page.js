

class Page {
    constructor(regexPattern = null, actionPost = null, getRegexPattern = null, actionGet = null) {

        this.regexPattern = regexPattern;
        this.actionPost = actionPost;
        this.actionGet = actionGet;
        this.getRegexPattern = getRegexPattern;

    }

    matchesPagePost(page) {
        if (this.regexPattern) {
            return page.match(this.regexPattern);
        } else {
            return false;
        }
    }

    matchesPageGet(page) {
        if (this.getRegexPattern) {
            return page.match(this.getRegexPattern);
        } else {
            return false;
        }
    }

    get(params, req, res) {
        if (this.actionGet) {
            this.actionGet(params, req, res);
        }
    }

    post(params, req, res) {
        if (this.actionPost) {
            this.actionPost(params, req, res);
        }
    }
}

module.exports.Page = Page;
