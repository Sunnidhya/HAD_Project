package com.example.had_backend.Global.Model;

import com.example.had_backend.Global.Entity.Chats;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.lang.Nullable;


@Getter
@Setter
public class ThreadsDTO {
    @Nullable
    private String userName;

    @Nullable
    private String text;

    @Nullable
    private String imageURL;

    @Nullable
    private String timeStamp;
}
