module Tsuki 
  module Text_Input
    Text_Variable = 1
    Max_Chars = 12
  end
end

class Scene_Text < Scene_MenuBase
  
  def start
    super
    @text = ""
    @max_char = 12
    @var = Tsuki::Text_Input::Text_Variable
  end
  #--------------------------------------------------------------------------
  # * Prepare
  #--------------------------------------------------------------------------
  def prepare(text, var, max_char)
    @text = text
    @var = var
    @max_char = max_char
  end
  #--------------------------------------------------------------------------
  # * Start Processing
  #--------------------------------------------------------------------------
  def start
    super
    @edit_window = Window_TextEdit.new(@text, @max_char)
    @input_window = Window_TextInput.new(@edit_window)
    @input_window.set_handler(:ok, method(:on_input_ok))
  end
  #--------------------------------------------------------------------------
  # * Input [OK]
  #--------------------------------------------------------------------------
  def on_input_ok
    $game_variables[@var] = @edit_window.name
    return_scene
  end
end

class Window_TextEdit < Window_Base
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader   :name                     # name
  attr_reader   :index                    # cursor position
  attr_reader   :max_char                 # maximum number of characters
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize(text, max_char)
    x = (Graphics.width - 360) / 2
    y = (Graphics.height - (fitting_height(4) + fitting_height(9) + 8)) / 2
    super(x, y, 360, fitting_height(4))
    @text = text
    @default_name = ""
    @name = ""
    @max_char = max_char
    @index = @name.size
    deactivate
    refresh
  end
  #--------------------------------------------------------------------------
  # * Revert to Default Name
  #--------------------------------------------------------------------------
  def restore_default
    @name = @default_name
    @index = @name.size
    refresh
    return !@name.empty?
  end
  #--------------------------------------------------------------------------
  # * Add Text Character
  #     ch : character to add
  #--------------------------------------------------------------------------
  def add(ch)
    return false if @index >= @max_char
    @name += ch
    @index += 1
    refresh
    return true
  end
  #--------------------------------------------------------------------------
  # * Go Back One Character
  #--------------------------------------------------------------------------
  def back
    return false if @index == 0
    @index -= 1
    @name = @name[0, @index]
    refresh
    return true
  end
  #--------------------------------------------------------------------------
  # * Get Character Width
  #--------------------------------------------------------------------------
  def char_width
    text_size($game_system.japanese? ? "��" : "A").width 
  end
  #--------------------------------------------------------------------------
  # * Get Coordinates of Left Side for Drawing Name
  #--------------------------------------------------------------------------
  def left
    name_center = contents_width / 2
    name_width = (@max_char + 1) * char_width
    return [name_center - name_width / 2, contents_width - name_width].min
  end
  #--------------------------------------------------------------------------
  # * Get Rectangle for Displaying Item
  #--------------------------------------------------------------------------
  def item_rect(index)
    Rect.new(left + index * char_width, 36, char_width, line_height)
  end
  #--------------------------------------------------------------------------
  # * Get Underline Rectangle
  #--------------------------------------------------------------------------
  def underline_rect(index)
    rect = item_rect(index)
    rect.x += 1
    rect.y += rect.height
    rect.width -= 2
    rect.height = 2
    rect
  end
  #--------------------------------------------------------------------------
  # * Get Underline Color
  #--------------------------------------------------------------------------
  def underline_color
    color = normal_color
    color.alpha = 48
    color
  end
  #--------------------------------------------------------------------------
  # * Draw Underline
  #--------------------------------------------------------------------------
  def draw_underline(index)
    contents.fill_rect(underline_rect(index), underline_color)
  end
  #--------------------------------------------------------------------------
  # * Draw Text
  #--------------------------------------------------------------------------
  def draw_char(index)
    rect = item_rect(index)
    rect.x -= 1
    rect.width += 4
    change_color(normal_color)
    draw_text(rect, @name[index] || "")
  end
  #--------------------------------------------------------------------------
  # * Refresh
  #--------------------------------------------------------------------------
  def draw_title
    draw_text(0, 10, self.width, line_height, @text, 1)
  end
  
  def refresh
    contents.clear
    draw_title
    @name.size.times {|i| draw_char(i) }
    @max_char.times {|i| draw_underline(i) }
    cursor_rect.set(item_rect(@index))
  end
end

class Window_TextInput < Window_NameInput
  def on_name_ok
    Sound.play_ok
    call_ok_handler
  end
end

class Game_Interpreter
  
  def enter_text(text="", var=Tsuki::Text_Input::Text_Variable, max_char=Tsuki::Text_Input::Max_Chars)
    SceneManager.call(Scene_Text)
    SceneManager.scene.prepare(text, var, max_char)
    Fiber.yield while SceneManager.scene_is?(Scene_Text)
  end
end