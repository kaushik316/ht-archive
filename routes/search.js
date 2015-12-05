// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

<<<<<<< 17daf3d758b05376a6b6611d5e492924e054f6cd
var daos = require("./daos");
=======
var daos        = require("./daos")
  , cheerio      = require("cheerio");
>>>>>>> Initial commit

function SearchHandler(db) {
    "use strict";

    var searchdao = new daos.SearchDAO(db);

    this.displaySearch = function(req, res, next) {
        "use strict";

        if(!req.usr) return res.redirect("/login");

        searchdao.getAreas(function(err, areas) {
            return res.render("index", {
                search_type: "text",
                text: "",
                areas: areas,
                phone: "",
                email: "",
                usr: req.usr
            });
        });
    }

<<<<<<< 17daf3d758b05376a6b6611d5e492924e054f6cd
    this.handleSearch = function(req, res, next) {
=======
    this.handleQuery = function(req, res, next) {
>>>>>>> Initial commit
        "use strict";
        var errs  = ""
        var text  = req.body.search_text;
        var area  = req.body.search_area;
        var phone = req.body.phone;
        var email = req.body.email;

        searchdao.getQuery(text, phone, email, area, function(err, qs, cur) {
            if(err) {
                req.errs = "Error: database error";
                return res.render("index");
            }
            if(!res) {
                req.errs = "Error: no search results";
                return res.render("index");
            }

            cur.count(function(err, count) {
                cur.limit(20).toArray(function(err, docs) {
                    if(count > 20) {
                        res.render("search", {"docs": docs, "page": 1, "first_doc": 0,
                            "next": 2, "count": count, "qs": qs});
                    } else {
                        res.render("search", {"docs": docs, "page": 1, "first_doc": 0,
                            "count": count, "qs": qs});
                    }
                });
            });
        });
    }

    function getNext(doc, cb, fin) {
        var curr = doc["page"];
        var count = doc["count"];

        if((curr * 20) <= count) {
            doc["next"] = curr + 1;
            return cb(doc, fin);
        } else {
            return cb(doc, fin);
        }
    }

    function getPrev(doc, cb) {
        var curr = doc["page"];

        if(curr > 0) {
            doc["prev"] = curr - 1;
            return cb(doc);
        } else {
            return cb(doc);
        }
    }

    function processCursor(cur, doc, cb) {
        cur.skip(doc["first_doc"]);
        cur.limit(20).toArray(function(err, docs) {
            doc["docs"] = docs;
            getNext(doc, getPrev, cb);
        });
    }

<<<<<<< 17daf3d758b05376a6b6611d5e492924e054f6cd
    this.handleQuery = function(req, res, next) {
=======
    this.displayQuery = function(req, res, next) {
>>>>>>> Initial commit
        "use strict";
        searchdao.getQuery(req.query["text"], req.query["phone"],
                req.query["email"], req.query["area"], function(err, qs, cur) {
                    var num_re = /^[0-9]+$/;
                    var pagenum = req.query["page"] - 1;
                    var first_doc = 0;
                    if(pagenum > 0) {
                        if(num_re.test(pagenum)) {
                            pagenum = parseInt(pagenum);
                            first_doc = pagenum * 20;
                        } else {
                            return next(Error("page number must be an integer"));
                        }
                    } else {
                        pagenum = 0;
                    }
                    var doc = { "page": pagenum + 1, "qs": qs, "first_doc": first_doc };
                    cur.count(function(err,count) {
                        doc["count"] = count;
                        processCursor(cur, doc, function(doc) {
                            res.render("search", doc);
                        });
                    });
                });
    }
<<<<<<< 17daf3d758b05376a6b6611d5e492924e054f6cd
}

=======

    this.parseShow = function(req, res, next) {
        if(req.query && req.query["id"]) {
            searchdao.getDoc(req.query["id"], function(err, doc) {
                if(err) return next(err);

                if(!doc) {
                    return res.render("Oops", {"error": "No document found"});
                }
                req.doc = doc;
                next();
            });
        } else {
            res.render("Oops", {"error": "Document could not be found"});
        }
    }

    this.displayShow = function(req, res, next) {
        "use strict";
        if(req.doc && req.doc["source"]) {
            req.doc["source"] = cheerio.load(req.doc.source)("div.mainBody").html();
            req.doc["source"] = req.doc["source"].replace("\n\r", "");
            return res.render("show", {"doc": req.doc});
        } else {
            return res.render("Oops", {"error": "Document could not be found"});
        }
    }

    this.handleShow = function(req, res, next) {
        "use strict";

        var id = req.body.id;
        searchdao.getDoc(id, function(err, doc) {
            if(err) return next(err);

            if(!doc) {
                return res.render("Oops", {"error": "No document found"});
            }
            req.doc = doc;
            next();
        });
    }
}


>>>>>>> Initial commit
module.exports = SearchHandler;