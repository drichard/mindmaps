describe("Command", function() {
  var command, handler;
  
  beforeEach(function() {
    command = new mindmaps.Command();
    handler = jasmine.createSpy();
  });
  
  it("should call a handler when executed", function() {
    command.setHandler(handler);
    command.execute();
    
    expect(handler).toHaveBeenCalled();
  });
  
  it("should notify when a handler was registered", function() {
    var callback = jasmine.createSpy();
    command.subscribe(mindmaps.Command.Event.HANDLER_REGISTERED, callback);
    command.setHandler(handler);
    
    expect(callback).toHaveBeenCalled();
    
  });
  
  it("should notify when a handler was removed", function() {
    var callback = jasmine.createSpy();
    command.setHandler(handler);
    command.subscribe(mindmaps.Command.Event.HANDLER_REMOVED, callback);
    command.removeHandler();
    
    expect(callback).toHaveBeenCalled();
  });
  
  it("should notify when the enabled state has changed", function() {
    var callback = jasmine.createSpy();
    command.setHandler(handler);
    command.subscribe(mindmaps.Command.Event.ENABLED_CHANGED, callback);
    
    // string instead of boolean so jasmine checks if argument was the same
    command.setEnabled("false");
    expect(callback).toHaveBeenCalledWith("false");
    
    command.setEnabled("true");
    expect(callback).toHaveBeenCalledWith("true");
  });
});

describe("CommandRegistry", function() {
  var registry;
  var type;
  
  beforeEach(function() {
    registry = new mindmaps.CommandRegistry;
    type = mindmaps.Command;
  });
  
  it("should a return a command object for a command type", function() {
    var command = registry.get(type);
    
    expect(command).toBeDefined();
    expect(command instanceof type).toBeTruthy();
  });
  
  it("should always return the same command object", function() {
    var command1 = registry.get(type);
    var command2 = registry.get(type);
    
    expect(command1).toBe(command2);
  });
  
  it("should remove a command type", function() {
    var command1 = registry.get(type);
    registry.remove(type);
    
    // this should be a new instance now
    var command2 = registry.get(type);
    expect(command1).not.toBe(command2);
  });
});
