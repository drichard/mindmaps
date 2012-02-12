describe("Point", function() {
  var point;
  beforeEach(function() {
    point = new mindmaps.Point(4, 2);
  });

  it("should set the x and y coordinates", function() {
    expect(point.x).toBe(4);
    expect(point.y).toBe(2);
  });

  it("should initialize to zero by default", function() {
    var p = new mindmaps.Point();
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
  });

  it("should create a new point instance from object", function() {
    var o = {
      x : 16,
      y : 0
    };
    var fromObj = mindmaps.Point.fromObject(o);
    expect(fromObj instanceof mindmaps.Point).toBeTruthy();
    expect(fromObj.x).toBe(16);
    expect(fromObj.y).toBe(0);
  });

  it("should clone a point object correctly", function() {
    var clone = point.clone();
    expect(point).toEqual(clone);
  });

  it("should add points correctly", function() {
    var point2 = new mindmaps.Point(-4, -2);
    point.add(point2);
    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
  });
});
