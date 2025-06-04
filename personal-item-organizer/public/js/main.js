// 自动关闭警告提示
document.addEventListener('DOMContentLoaded', function() {
  // 获取所有警告提示
  const alerts = document.querySelectorAll('.alert');
  
  // 设置自动关闭
  alerts.forEach(alert => {
    setTimeout(() => {
      // 创建 bootstrap alert 对象并调用 close 方法
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000); // 5秒后自动关闭
  });
  
  // 确认删除操作
  const deleteButtons = document.querySelectorAll('button[onclick^="return confirm"]');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 阻止表单提交，等待确认结果
      e.preventDefault();
      
      // 获取确认消息并显示确认对话框
      const form = this.closest('form');
      const confirmMessage = this.getAttribute('onclick').replace('return confirm(\'', '').replace('\')', '');
      
      if (confirm(confirmMessage)) {
        form.submit();
      }
    });
  });
});